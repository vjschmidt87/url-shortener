package com.portfolio.urlshortener.service;

import com.portfolio.urlshortener.dto.request.ShortenRequest;
import com.portfolio.urlshortener.dto.response.ShortUrlResponse;
import com.portfolio.urlshortener.entity.ShortUrl;
import com.portfolio.urlshortener.entity.User;
import com.portfolio.urlshortener.exception.BadRequestException;
import com.portfolio.urlshortener.exception.ResourceNotFoundException;
import com.portfolio.urlshortener.exception.UnauthorizedException;
import com.portfolio.urlshortener.repository.ShortUrlRepository;
import com.portfolio.urlshortener.repository.UserRepository;
import com.portfolio.urlshortener.util.ShortCodeGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UrlService {

    private final ShortUrlRepository shortUrlRepository;
    private final UserRepository userRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    public UrlService(ShortUrlRepository shortUrlRepository, UserRepository userRepository) {
        this.shortUrlRepository = shortUrlRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ShortUrlResponse shorten(ShortenRequest request, String username) {
        String code;
        if (request.customAlias() != null && !request.customAlias().isBlank()) {
            code = request.customAlias();
            if (shortUrlRepository.existsByShortCode(code)) {
                throw new BadRequestException("Custom alias already taken");
            }
        } else {
            code = generateUniqueCode();
        }

        ShortUrl shortUrl = new ShortUrl();
        shortUrl.setOriginalUrl(request.originalUrl());
        shortUrl.setShortCode(code);
        shortUrl.setCustomAlias(request.customAlias());
        shortUrl.setTitle(request.title());
        shortUrl.setExpiresAt(request.expiresAt());

        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            shortUrl.setUser(user);
        }

        shortUrlRepository.save(shortUrl);
        return ShortUrlResponse.from(shortUrl, baseUrl);
    }

    public List<ShortUrlResponse> getUserUrls(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shortUrlRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(url -> ShortUrlResponse.from(url, baseUrl))
                .toList();
    }

    public ShortUrlResponse getById(Long id, String username) {
        ShortUrl url = shortUrlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));
        if (url.getUser() == null || !url.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("Access denied");
        }
        return ShortUrlResponse.from(url, baseUrl);
    }

    @Transactional
    public void delete(Long id, String username) {
        ShortUrl url = shortUrlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));
        if (url.getUser() == null || !url.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("Access denied");
        }
        shortUrlRepository.delete(url);
    }

    @Transactional
    public ShortUrlResponse toggleActive(Long id, String username) {
        ShortUrl url = shortUrlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));
        if (url.getUser() == null || !url.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("Access denied");
        }
        url.setActive(!url.getActive());
        shortUrlRepository.save(url);
        return ShortUrlResponse.from(url, baseUrl);
    }

    public ShortUrl findByCode(String code) {
        return shortUrlRepository.findByShortCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));
    }

    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        do {
            code = ShortCodeGenerator.generate();
            attempts++;
            if (attempts > 10) throw new BadRequestException("Could not generate unique code");
        } while (shortUrlRepository.existsByShortCode(code));
        return code;
    }
}
