package com.portfolio.urlshortener.repository;

import com.portfolio.urlshortener.entity.ShortUrl;
import com.portfolio.urlshortener.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShortUrlRepository extends JpaRepository<ShortUrl, Long> {
    Optional<ShortUrl> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    List<ShortUrl> findByUserOrderByCreatedAtDesc(User user);
}
