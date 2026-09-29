package com.portfolio.urlshortener.service;

import com.portfolio.urlshortener.dto.response.AnalyticsResponse;
import com.portfolio.urlshortener.entity.ClickEvent;
import com.portfolio.urlshortener.entity.ShortUrl;
import com.portfolio.urlshortener.exception.ResourceNotFoundException;
import com.portfolio.urlshortener.exception.UnauthorizedException;
import com.portfolio.urlshortener.repository.ClickEventRepository;
import com.portfolio.urlshortener.repository.ShortUrlRepository;
import com.portfolio.urlshortener.util.UserAgentParser;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AnalyticsService {

    private final ClickEventRepository clickEventRepository;
    private final ShortUrlRepository shortUrlRepository;

    public AnalyticsService(ClickEventRepository clickEventRepository, ShortUrlRepository shortUrlRepository) {
        this.clickEventRepository = clickEventRepository;
        this.shortUrlRepository = shortUrlRepository;
    }

    @Transactional
    public void recordClick(ShortUrl shortUrl, String ipAddress, String userAgent, String referer) {
        ClickEvent event = new ClickEvent();
        event.setShortUrl(shortUrl);
        event.setIpAddress(ipAddress);
        event.setUserAgent(userAgent);
        event.setReferer(referer);
        event.setBrowser(UserAgentParser.parseBrowser(userAgent));
        event.setOs(UserAgentParser.parseOs(userAgent));
        clickEventRepository.save(event);

        shortUrl.setTotalClicks(shortUrl.getTotalClicks() + 1);
        shortUrlRepository.save(shortUrl);
    }

    public AnalyticsResponse getAnalytics(Long urlId, String username) {
        ShortUrl url = shortUrlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));
        if (url.getUser() == null || !url.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("Access denied");
        }

        List<AnalyticsResponse.DayCount> byDay = clickEventRepository.countByDay(url).stream()
                .map(row -> new AnalyticsResponse.DayCount(
                        row[0] instanceof LocalDate ld ? ld : ((java.sql.Date) row[0]).toLocalDate(),
                        (Long) row[1]))
                .toList();

        List<AnalyticsResponse.NameCount> byBrowser = clickEventRepository.countByBrowser(url).stream()
                .map(row -> new AnalyticsResponse.NameCount((String) row[0], (Long) row[1]))
                .toList();

        List<AnalyticsResponse.NameCount> byOs = clickEventRepository.countByOs(url).stream()
                .map(row -> new AnalyticsResponse.NameCount((String) row[0], (Long) row[1]))
                .toList();

        List<AnalyticsResponse.NameCount> byCountry = clickEventRepository.countByCountry(url).stream()
                .map(row -> new AnalyticsResponse.NameCount((String) row[0], (Long) row[1]))
                .toList();

        List<AnalyticsResponse.RecentClick> recent = clickEventRepository
                .findByShortUrlOrderByClickedAtDesc(url, PageRequest.of(0, 20)).stream()
                .map(e -> new AnalyticsResponse.RecentClick(
                        e.getClickedAt(), e.getBrowser(), e.getOs(), e.getCountry(), e.getReferer()))
                .toList();

        return new AnalyticsResponse(
                url.getTotalClicks(),
                url.getOriginalUrl(),
                url.getShortCode(),
                byDay, byBrowser, byOs, byCountry, recent
        );
    }
}
