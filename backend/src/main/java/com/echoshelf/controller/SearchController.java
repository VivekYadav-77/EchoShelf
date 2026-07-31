package com.echoshelf.controller;

import com.echoshelf.dto.common.ApiResponse;
import com.echoshelf.dto.search.ItunesSearchResponse;
import com.echoshelf.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ItunesSearchResponse>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "album") String type,
            @RequestParam(defaultValue = "20") int limit) {
        
        // We focus on albums based on the assignment entity choice
        ItunesSearchResponse response = searchService.searchAlbums(query, limit);
        return ResponseEntity.ok(ApiResponse.success("Search completed", response));
    }
}
