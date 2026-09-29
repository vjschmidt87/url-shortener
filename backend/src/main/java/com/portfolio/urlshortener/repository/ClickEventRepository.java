package com.portfolio.urlshortener.repository;

import com.portfolio.urlshortener.entity.ClickEvent;
import com.portfolio.urlshortener.entity.ShortUrl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {

    List<ClickEvent> findByShortUrlOrderByClickedAtDesc(ShortUrl shortUrl, Pageable pageable);

    @Query("SELECT CAST(c.clickedAt AS date) AS day, COUNT(c) AS cnt FROM ClickEvent c " +
           "WHERE c.shortUrl = :url GROUP BY CAST(c.clickedAt AS date) ORDER BY day")
    List<Object[]> countByDay(@Param("url") ShortUrl url);

    @Query("SELECT c.browser, COUNT(c) FROM ClickEvent c WHERE c.shortUrl = :url GROUP BY c.browser ORDER BY COUNT(c) DESC")
    List<Object[]> countByBrowser(@Param("url") ShortUrl url);

    @Query("SELECT c.os, COUNT(c) FROM ClickEvent c WHERE c.shortUrl = :url GROUP BY c.os ORDER BY COUNT(c) DESC")
    List<Object[]> countByOs(@Param("url") ShortUrl url);

    @Query("SELECT c.country, COUNT(c) FROM ClickEvent c WHERE c.shortUrl = :url GROUP BY c.country ORDER BY COUNT(c) DESC")
    List<Object[]> countByCountry(@Param("url") ShortUrl url);
}
