package com.echoshelf.controller;

import com.echoshelf.dto.analytics.ChartDataDTO;
import com.echoshelf.dto.common.ApiResponse;
import com.echoshelf.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/genre-distribution")
    public ResponseEntity<ApiResponse<List<ChartDataDTO>>> getGenreDistribution() {
        return ResponseEntity.ok(ApiResponse.success("Success", analyticsService.getGenreDistribution()));
    }

    @GetMapping("/releases-by-year")
    public ResponseEntity<ApiResponse<List<ChartDataDTO>>> getReleasesByYear() {
        return ResponseEntity.ok(ApiResponse.success("Success", analyticsService.getReleasesByYear()));
    }

    @GetMapping("/top-artists")
    public ResponseEntity<ApiResponse<List<ChartDataDTO>>> getTopArtists() {
        return ResponseEntity.ok(ApiResponse.success("Success", analyticsService.getTopArtists()));
    }

    @GetMapping("/rating-distribution")
    public ResponseEntity<ApiResponse<List<ChartDataDTO>>> getRatingDistribution() {
        return ResponseEntity.ok(ApiResponse.success("Success", analyticsService.getRatingDistribution()));
    }

    @GetMapping("/price-histogram")
    public ResponseEntity<ApiResponse<List<ChartDataDTO>>> getPriceHistogram() {
        return ResponseEntity.ok(ApiResponse.success("Success", analyticsService.getPriceHistogram()));
    }
}
