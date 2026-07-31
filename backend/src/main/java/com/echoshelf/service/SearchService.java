package com.echoshelf.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.echoshelf.dto.search.ItunesSearchResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class SearchService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public SearchService() {
        this.objectMapper = new ObjectMapper();
        this.restClient = RestClient.builder()
                .baseUrl("https://itunes.apple.com")
                .build();
    }

    public ItunesSearchResponse searchAlbums(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }

        try {
            String rawResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("term", query)
                            .queryParam("entity", "album")
                            .queryParam("limit", limit)
                            .build())
                    .retrieve()
                    .body(String.class);

            return objectMapper.readValue(rawResponse, ItunesSearchResponse.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to fetch search results from iTunes");
        }
    }
}
