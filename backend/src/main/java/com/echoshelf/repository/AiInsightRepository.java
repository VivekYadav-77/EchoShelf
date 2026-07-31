package com.echoshelf.repository;

import com.echoshelf.entity.AiInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiInsightRepository extends JpaRepository<AiInsight, Long> {
    Optional<AiInsight> findByUserId(Long userId);
}
