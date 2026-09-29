package com.portfolio.urlshortener.dto.response;

import com.portfolio.urlshortener.entity.ShortUrl;

import java.time.LocalDateTime;

public record ShortUrlResponse(
    Long id,
    String originalUrl,
    String shortCode,
    String shortUrl,
    String customAlias,
    String title,
    String username,
    Boolean active,
    Long totalClicks,
    LocalDateTime expiresAt,
    LocalDateTime createdAt
) {
    public static ShortUrlResponse from(ShortUrl entity, String baseUrl) {
        return new ShortUrlResponse(
            entity.getId(),
            entity.getOriginalUrl(),
            entity.getShortCode(),
            baseUrl + "/r/" + entity.getShortCode(),
            entity.getCustomAlias(),
            entity.getTitle(),
            entity.getUser() != null ? entity.getUser().getUsername() : null,
            entity.getActive(),
            entity.getTotalClicks(),
            entity.getExpiresAt(),
            entity.getCreatedAt()
        );
    }
}
