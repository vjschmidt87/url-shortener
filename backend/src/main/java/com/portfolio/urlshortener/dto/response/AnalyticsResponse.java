package com.portfolio.urlshortener.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record AnalyticsResponse(
    Long totalClicks,
    String originalUrl,
    String shortCode,
    List<DayCount> clicksByDay,
    List<NameCount> clicksByBrowser,
    List<NameCount> clicksByOs,
    List<NameCount> clicksByCountry,
    List<RecentClick> recentClicks
) {
    public record DayCount(LocalDate date, Long count) {}
    public record NameCount(String name, Long count) {}
    public record RecentClick(LocalDateTime clickedAt, String browser, String os, String country, String referer) {}
}
