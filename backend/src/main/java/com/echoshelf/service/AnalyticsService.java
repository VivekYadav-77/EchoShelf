package com.echoshelf.service;

import com.echoshelf.dto.analytics.ChartDataDTO;
import com.echoshelf.entity.User;
import com.echoshelf.repository.LibraryItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final LibraryItemRepository libraryItemRepository;
    private final UserContextService userContextService;

    public AnalyticsService(LibraryItemRepository libraryItemRepository, UserContextService userContextService) {
        this.libraryItemRepository = libraryItemRepository;
        this.userContextService = userContextService;
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
        return mapToDTOList(libraryItemRepository.getGenreDistribution(userContextService.getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getReleasesByYear() {
        return mapToDTOList(libraryItemRepository.getReleasesByYear(userContextService.getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getTopArtists() {
        return mapToDTOList(libraryItemRepository.getTopArtists(userContextService.getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getRatingDistribution() {
        return mapToDTOList(libraryItemRepository.getRatingDistribution(userContextService.getCurrentUser().getId()));
    }

    public List<ChartDataDTO> getPriceHistogram() {
        return mapToDTOList(libraryItemRepository.getPriceHistogram(userContextService.getCurrentUser().getId()));
    }
}
