package com.portfolio.urlshortener.controller;

import com.portfolio.urlshortener.dto.request.LoginRequest;
import com.portfolio.urlshortener.dto.request.RegisterRequest;
import com.portfolio.urlshortener.dto.response.AuthResponse;
import com.portfolio.urlshortener.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
