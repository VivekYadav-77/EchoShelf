package com.echoshelf.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.echoshelf.dto.ai.LibrarySummaryResponse;
import com.echoshelf.entity.AiInsight;
import com.echoshelf.entity.User;
import com.echoshelf.repository.AiInsightRepository;
import com.echoshelf.repository.LibraryItemRepository;
import com.echoshelf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final LibraryItemRepository libraryItemRepository;
    private final UserRepository userRepository;
    private final AiInsightRepository aiInsightRepository;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    public AiService(LibraryItemRepository libraryItemRepository, UserRepository userRepository, AiInsightRepository aiInsightRepository) {
        this.libraryItemRepository = libraryItemRepository;
        this.userRepository = userRepository;
        this.aiInsightRepository = aiInsightRepository;
        this.objectMapper = new ObjectMapper();
        this.restClient = RestClient.builder().baseUrl("https://generativelanguage.googleapis.com/v1beta/openai/").build();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public LibrarySummaryResponse getLatestLibrarySummary() {
        User user = getCurrentUser();
        Optional<AiInsight> insightOpt = aiInsightRepository.findByUserId(user.getId());

        if (insightOpt.isEmpty()) {
            return null; // Signals that no analysis has been done yet
        }

        AiInsight insight = insightOpt.get();
        LibrarySummaryResponse response = new LibrarySummaryResponse();
        response.setSummary(insight.getSummary());

        try {
            List<LibrarySummaryResponse.Recommendation> recs = objectMapper.readValue(
                    insight.getRecommendations(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, LibrarySummaryResponse.Recommendation.class)
            );
            response.setRecommendations(recs);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            response.setRecommendations(List.of());
        }

        return response;
    }

    public LibrarySummaryResponse generateLibrarySummary() {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return buildFallbackResponse("API key is not configured.");
        }

        User user = getCurrentUser();
        Long userId = user.getId();

        // 1. Gather stats
        List<Map<String, Object>> genreData = libraryItemRepository.getGenreDistribution(userId);
        List<Map<String, Object>> artistData = libraryItemRepository.getTopArtists(userId);

        String genres = genreData.stream().map(g -> g.get("label").toString()).limit(5).collect(Collectors.joining(", "));
        String artists = artistData.stream().map(a -> a.get("label").toString()).limit(5).collect(Collectors.joining(", "));

        if (genres.isEmpty()) {
            throw new IllegalArgumentException("Library is too small for AI analysis. Add some albums first!");
        }

        // 2. Build prompt
        String prompt = "You are a music expert. A user has a music library with the following top genres: " + genres + 
                ", and top artists: " + artists + ". " +
                "Write a 2-paragraph engaging summary of their music taste. " +
                "Then, provide exactly 3 album recommendations they'd likely enjoy in valid JSON format ONLY. " +
                "The JSON must have this structure: {\"summary\": \"your 2 paragraphs\", \"recommendations\": [{\"title\":\"..\",\"artist\":\"..\",\"reason\":\"..\"}]}";

        // 3. Call Gemini
        try {
            String requestBody = """
                {
                    "model": "gemini-3.1-flash-lite",
                    "messages": [
                        {"role": "system", "content": "You output strict JSON matching the requested structure."},
                        {"role": "user", "content": "%s"}
                    ],
                    "response_format": { "type": "json_object" }
                }
                """.formatted(prompt.replace("\"", "\\\""));

            String responseBody = restClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(responseBody);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            
            LibrarySummaryResponse response = objectMapper.readValue(content, LibrarySummaryResponse.class);

            // 4. Save to DB
            AiInsight insight = aiInsightRepository.findByUserId(userId).orElse(new AiInsight());
            insight.setUserId(userId);
            insight.setSummary(response.getSummary());
            insight.setRecommendations(objectMapper.writeValueAsString(response.getRecommendations()));
            aiInsightRepository.save(insight);
            
            return response;
            
        } catch (Exception e) {
            e.printStackTrace();
            return buildFallbackResponse("Error: " + e.getMessage());
        }
    }

    private LibrarySummaryResponse buildFallbackResponse(String reason) {
        LibrarySummaryResponse fallback = new LibrarySummaryResponse();
        fallback.setSummary("AI features are currently unavailable. Reason: " + reason);
        fallback.setRecommendations(List.of());
        return fallback;
    }
}
