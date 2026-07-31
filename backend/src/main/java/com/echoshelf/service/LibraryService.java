package com.echoshelf.service;

import com.echoshelf.dto.library.LibraryItemDTO;
import com.echoshelf.dto.library.SaveLibraryItemRequest;
import com.echoshelf.dto.library.UpdateLibraryItemRequest;
import com.echoshelf.entity.LibraryItem;
import com.echoshelf.entity.User;
import com.echoshelf.repository.LibraryItemRepository;
import com.echoshelf.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LibraryService {

    private final LibraryItemRepository libraryItemRepository;
    private final UserRepository userRepository;

    public LibraryService(LibraryItemRepository libraryItemRepository, UserRepository userRepository) {
        this.libraryItemRepository = libraryItemRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public Page<LibraryItemDTO> getUserLibrary(Pageable pageable) {
        User user = getCurrentUser();
        return libraryItemRepository.findAllByUserId(user.getId(), pageable)
                .map(this::mapToDTO);
    }

    public LibraryItemDTO saveToLibrary(SaveLibraryItemRequest request) {
        User user = getCurrentUser();

        if (libraryItemRepository.existsByUserIdAndAppleCatalogId(user.getId(), request.getAppleCatalogId())) {
            throw new IllegalArgumentException("Album already saved to library");
        }

        LibraryItem item = new LibraryItem();
        item.setUser(user);
        item.setAppleCatalogId(request.getAppleCatalogId());
        item.setTitle(request.getTitle());
        item.setArtistName(request.getArtistName());
        item.setGenre(request.getGenre());
        item.setReleaseDate(request.getReleaseDate());
        item.setTrackCount(request.getTrackCount());
        item.setArtworkUrl(request.getArtworkUrl());
        item.setCollectionPrice(request.getCollectionPrice());

        LibraryItem saved = libraryItemRepository.save(item);
        return mapToDTO(saved);
    }

    public LibraryItemDTO updateLibraryItem(Long id, UpdateLibraryItemRequest request) {
        User user = getCurrentUser();

        LibraryItem item = libraryItemRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Library item not found or you don't have access"));

        if (request.getUserRating() != null) {
            item.setUserRating(request.getUserRating());
        }
        if (request.getUserNotes() != null) {
            item.setUserNotes(request.getUserNotes());
        }

        LibraryItem updated = libraryItemRepository.save(item);
        return mapToDTO(updated);
    }

    public void deleteLibraryItem(Long id) {
        User user = getCurrentUser();
        
        LibraryItem item = libraryItemRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Library item not found or you don't have access"));

        libraryItemRepository.delete(item);
    }

    private LibraryItemDTO mapToDTO(LibraryItem item) {
        LibraryItemDTO dto = new LibraryItemDTO();
        dto.setId(item.getId());
        dto.setAppleCatalogId(item.getAppleCatalogId());
        dto.setTitle(item.getTitle());
        dto.setArtistName(item.getArtistName());
        dto.setGenre(item.getGenre());
        dto.setReleaseDate(item.getReleaseDate());
        dto.setTrackCount(item.getTrackCount());
        dto.setArtworkUrl(item.getArtworkUrl());
        dto.setCollectionPrice(item.getCollectionPrice());
        dto.setUserRating(item.getUserRating());
        dto.setUserNotes(item.getUserNotes());
        dto.setCreatedAt(item.getCreatedAt());
        return dto;
    }
}
