package com.echoshelf.service;

import com.echoshelf.dto.library.LibraryItemDTO;
import com.echoshelf.dto.library.SaveLibraryItemRequest;
import com.echoshelf.entity.LibraryItem;
import com.echoshelf.entity.User;
import com.echoshelf.repository.LibraryItemRepository;
import com.echoshelf.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LibraryServiceTest {

    @Mock
    private LibraryItemRepository libraryItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private LibraryService libraryService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@test.com");
        
        // Mock Security Context
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void saveToLibrary_Success() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@test.com");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(mockUser));
        when(libraryItemRepository.existsByUserIdAndAppleCatalogId(1L, 12345L)).thenReturn(false);

        SaveLibraryItemRequest request = new SaveLibraryItemRequest();
        request.setAppleCatalogId(12345L);
        request.setTitle("Test Album");
        request.setArtistName("Test Artist");

        LibraryItem savedItem = new LibraryItem();
        savedItem.setId(1L);
        savedItem.setAppleCatalogId(12345L);
        savedItem.setTitle("Test Album");
        savedItem.setArtistName("Test Artist");
        
        when(libraryItemRepository.save(any(LibraryItem.class))).thenReturn(savedItem);

        // Act
        LibraryItemDTO result = libraryService.saveToLibrary(request);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(12345L, result.getAppleCatalogId());
        assertEquals("Test Album", result.getTitle());
        verify(libraryItemRepository).save(any(LibraryItem.class));
    }

    @Test
    void saveToLibrary_AlreadyExists_ThrowsException() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@test.com");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(mockUser));
        when(libraryItemRepository.existsByUserIdAndAppleCatalogId(1L, 12345L)).thenReturn(true);

        SaveLibraryItemRequest request = new SaveLibraryItemRequest();
        request.setAppleCatalogId(12345L);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> libraryService.saveToLibrary(request));
        verify(libraryItemRepository, never()).save(any());
    }
}
