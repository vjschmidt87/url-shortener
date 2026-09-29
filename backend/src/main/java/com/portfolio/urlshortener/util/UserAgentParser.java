package com.portfolio.urlshortener.util;

public final class UserAgentParser {

    private UserAgentParser() {}

    public static String parseBrowser(String ua) {
        if (ua == null || ua.isEmpty()) return "Other";
        if (ua.contains("Edg/") || ua.contains("Edge/")) return "Edge";
        if (ua.contains("Chrome/") && !ua.contains("Chromium/")) return "Chrome";
        if (ua.contains("Firefox/")) return "Firefox";
        if (ua.contains("Safari/") && !ua.contains("Chrome/")) return "Safari";
        return "Other";
    }

    public static String parseOs(String ua) {
        if (ua == null || ua.isEmpty()) return "Other";
        if (ua.contains("Windows")) return "Windows";
        if (ua.contains("Macintosh") || ua.contains("Mac OS")) return "macOS";
        if (ua.contains("iPhone") || ua.contains("iPad")) return "iOS";
        if (ua.contains("Android")) return "Android";
        if (ua.contains("Linux")) return "Linux";
        return "Other";
    }
}
