package com.portfolio.urlshortener.config;

import com.portfolio.urlshortener.entity.ClickEvent;
import com.portfolio.urlshortener.entity.ShortUrl;
import com.portfolio.urlshortener.entity.User;
import com.portfolio.urlshortener.repository.ClickEventRepository;
import com.portfolio.urlshortener.repository.ShortUrlRepository;
import com.portfolio.urlshortener.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShortUrlRepository shortUrlRepository;
    private final ClickEventRepository clickEventRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random(42);

    private static final String[] BROWSERS = {"Chrome", "Firefox", "Safari", "Edge", "Other"};
    private static final String[] OSES = {"Windows", "macOS", "Linux", "Android", "iOS"};
    private static final String[] COUNTRIES = {"US", "BR", "DE", "JP", "UK", "FR", "CA", "AU"};
    private static final String[] REFERERS = {"https://google.com", "https://twitter.com", "https://reddit.com", null, null};

    public DataSeeder(UserRepository userRepository, ShortUrlRepository shortUrlRepository,
                      ClickEventRepository clickEventRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.shortUrlRepository = shortUrlRepository;
        this.clickEventRepository = clickEventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@urlshortener.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        userRepository.save(admin);

        ShortUrl url1 = createUrl(admin, "https://github.com/spring-projects/spring-boot", "ghSpBt", "Spring Boot GitHub");
        ShortUrl url2 = createUrl(admin, "https://angular.io/docs", "angDocs", "Angular Documentation");
        ShortUrl url3 = createUrl(admin, "https://stackoverflow.com/questions/tagged/java", "soJava", "StackOverflow Java");
        ShortUrl url4 = createUrl(admin, "https://www.postgresql.org/docs/current/", "pgDocs", "PostgreSQL Docs");
        ShortUrl url5 = createUrl(admin, "https://docs.docker.com/get-started/", "dkStart", "Docker Getting Started");

        generateClicks(url1, 18);
        generateClicks(url2, 12);
        generateClicks(url3, 10);
        generateClicks(url4, 8);
        generateClicks(url5, 6);
    }

    private ShortUrl createUrl(User user, String originalUrl, String shortCode, String title) {
        ShortUrl url = new ShortUrl();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(shortCode);
        url.setTitle(title);
        url.setUser(user);
        url.setActive(true);
        url.setTotalClicks(0L);
        return shortUrlRepository.save(url);
    }

    private void generateClicks(ShortUrl url, int count) {
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < count; i++) {
            ClickEvent event = new ClickEvent();
            event.setShortUrl(url);
            event.setClickedAt(now.minusDays(random.nextInt(7)).minusHours(random.nextInt(24)));
            event.setIpAddress("192.168.1." + random.nextInt(255));
            event.setBrowser(BROWSERS[random.nextInt(BROWSERS.length)]);
            event.setOs(OSES[random.nextInt(OSES.length)]);
            event.setCountry(COUNTRIES[random.nextInt(COUNTRIES.length)]);
            event.setReferer(REFERERS[random.nextInt(REFERERS.length)]);
            event.setUserAgent("Seeded click " + i);
            clickEventRepository.save(event);
        }
        url.setTotalClicks((long) count);
        shortUrlRepository.save(url);
    }
}
