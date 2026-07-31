package com.echoshelf.repository;

import com.echoshelf.entity.LibraryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {
    Page<LibraryItem> findAllByUserId(Long userId, Pageable pageable);
    Optional<LibraryItem> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndAppleCatalogId(Long userId, Long appleCatalogId);

    // Analytics queries
    @org.springframework.data.jpa.repository.Query("SELECT l.genre as label, COUNT(l) as value FROM LibraryItem l WHERE l.user.id = :userId GROUP BY l.genre")
    java.util.List<java.util.Map<String, Object>> getGenreDistribution(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT EXTRACT(YEAR FROM l.releaseDate) as label, COUNT(l) as value FROM LibraryItem l WHERE l.user.id = :userId AND l.releaseDate IS NOT NULL GROUP BY EXTRACT(YEAR FROM l.releaseDate) ORDER BY label")
    java.util.List<java.util.Map<String, Object>> getReleasesByYear(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT l.artistName as label, COUNT(l) as value FROM LibraryItem l WHERE l.user.id = :userId GROUP BY l.artistName ORDER BY value DESC")
    java.util.List<java.util.Map<String, Object>> getTopArtists(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT CAST(l.userRating AS string) as label, COUNT(l) as value FROM LibraryItem l WHERE l.user.id = :userId AND l.userRating IS NOT NULL GROUP BY l.userRating")
    java.util.List<java.util.Map<String, Object>> getRatingDistribution(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT CASE " +
            "WHEN l.collectionPrice < 5 THEN '<$5' " +
            "WHEN l.collectionPrice < 10 THEN '$5-$10' " +
            "WHEN l.collectionPrice < 15 THEN '$10-$15' " +
            "ELSE '$15+' END as label, COUNT(l) as value FROM LibraryItem l WHERE l.user.id = :userId GROUP BY " +
            "CASE WHEN l.collectionPrice < 5 THEN '<$5' " +
            "WHEN l.collectionPrice < 10 THEN '$5-$10' " +
            "WHEN l.collectionPrice < 15 THEN '$10-$15' " +
            "ELSE '$15+' END")
    java.util.List<java.util.Map<String, Object>> getPriceHistogram(Long userId);
}
