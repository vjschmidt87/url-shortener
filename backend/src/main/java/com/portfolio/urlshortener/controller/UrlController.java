package com.portfolio.urlshortener.controller;

import com.portfolio.urlshortener.dto.request.ShortenRequest;
import com.portfolio.urlshortener.dto.response.ShortUrlResponse;
import com.portfolio.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping("/shorten")
    @ResponseStatus(HttpStatus.CREATED)
    public ShortUrlResponse shorten(@Valid @RequestBody ShortenRequest request, Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        return urlService.shorten(request, username);
    }

    @GetMapping
    public List<ShortUrlResponse> getUserUrls(Authentication auth) {
        return urlService.getUserUrls(auth.getName());
    }

    @GetMapping("/{id}")
    public ShortUrlResponse getById(@PathVariable Long id, Authentication auth) {
        return urlService.getById(id, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication auth) {
        urlService.delete(id, auth.getName());
    }

    @PutMapping("/{id}/toggle")
    public ShortUrlResponse toggle(@PathVariable Long id, Authentication auth) {
        return urlService.toggleActive(id, auth.getName());
    }
}
