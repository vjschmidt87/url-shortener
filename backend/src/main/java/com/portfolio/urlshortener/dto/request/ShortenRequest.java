package com.portfolio.urlshortener.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public record ShortenRequest(
    @NotBlank String originalUrl,
    String customAlias,
    String title,
    LocalDateTime expiresAt
) {}
