package com.echoshelf.controller;

import com.echoshelf.dto.common.ApiResponse;
import com.echoshelf.dto.library.LibraryItemDTO;
import com.echoshelf.dto.library.SaveLibraryItemRequest;
import com.echoshelf.dto.library.UpdateLibraryItemRequest;
import com.echoshelf.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LibraryItemDTO>>> getLibrary(Pageable pageable) {
        Page<LibraryItemDTO> items = libraryService.getUserLibrary(pageable);
        return ResponseEntity.ok(ApiResponse.success("Library fetched successfully", items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LibraryItemDTO>> saveToLibrary(@Valid @RequestBody SaveLibraryItemRequest request) {
        LibraryItemDTO saved = libraryService.saveToLibrary(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Album saved to library", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LibraryItemDTO>> updateLibraryItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLibraryItemRequest request) {
        
        LibraryItemDTO updated = libraryService.updateLibraryItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Library item updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLibraryItem(@PathVariable Long id) {
        libraryService.deleteLibraryItem(id);
        return ResponseEntity.noContent().build();
    }
}
