package com.echoshelf.dto.library;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class UpdateLibraryItemRequest {

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer userRating;

    private String userNotes;

    // Getters and Setters
    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }
    public String getUserNotes() { return userNotes; }
    public void setUserNotes(String userNotes) { this.userNotes = userNotes; }
}
