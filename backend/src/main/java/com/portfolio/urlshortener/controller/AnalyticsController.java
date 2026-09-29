package com.portfolio.urlshortener.controller;

import com.portfolio.urlshortener.dto.response.AnalyticsResponse;
import com.portfolio.urlshortener.service.AnalyticsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/urls")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{id}/analytics")
    public AnalyticsResponse getAnalytics(@PathVariable Long id, Authentication auth) {
        return analyticsService.getAnalytics(id, auth.getName());
    }
}
