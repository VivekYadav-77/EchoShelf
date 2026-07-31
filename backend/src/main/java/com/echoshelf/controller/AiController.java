package com.echoshelf.controller;

import com.echoshelf.dto.ai.LibrarySummaryResponse;
import com.echoshelf.dto.common.ApiResponse;
import com.echoshelf.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/library-summary")
    public ResponseEntity<ApiResponse<LibrarySummaryResponse>> getLibrarySummary() {
        LibrarySummaryResponse summary = aiService.getLibrarySummary();
        return ResponseEntity.ok(ApiResponse.success("Success", summary));
    }
}
