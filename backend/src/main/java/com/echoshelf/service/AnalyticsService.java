package com.echoshelf.service;

import com.echoshelf.dto.analytics.ChartDataDTO;
import com.echoshelf.entity.User;
import com.echoshelf.repository.LibraryItemRepository;
import com.echoshelf.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final LibraryItemRepository libraryItemRepository;
    private final UserRepository userRepository;

    public AnalyticsService(LibraryItemRepository libraryItemRepository, UserRepository userRepository) {
        this.libraryItemRepository = libraryItemRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private List<ChartDataDTO> mapToDTOList(List<Map<String, Object>> results) {
        return results.stream()
                .map(row -> new ChartDataDTO(
                        String.valueOf(row.get("label")),
                        ((Number) row.get("value")).longValue()
                ))
                .collect(Collectors.toList());
    }

    public List<ChartDataDTO> getGenreDistribution() {
        return mapToDTOList(libraryItemRepository.getGenreDistribution(getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getReleasesByYear() {
        return mapToDTOList(libraryItemRepository.getReleasesByYear(getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getTopArtists() {
        return mapToDTOList(libraryItemRepository.getTopArtists(getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getRatingDistribution() {
        return mapToDTOList(libraryItemRepository.getRatingDistribution(getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getPriceHistogram() {
        return mapToDTOList(libraryItemRepository.getPriceHistogram(getCurrentUser().getId()));
    }
}
