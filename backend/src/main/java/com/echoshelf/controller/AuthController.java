package com.echoshelf.controller;

import com.echoshelf.dto.auth.AuthResponse;
import com.echoshelf.dto.auth.LoginRequest;
import com.echoshelf.dto.auth.RegisterRequest;
import com.echoshelf.dto.common.ApiResponse;
import com.echoshelf.entity.User;
import com.echoshelf.repository.UserRepository;
import com.echoshelf.service.AuthService;
import com.echoshelf.service.UserContextService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserContextService userContextService;

    @Value("${jwt.expiration-ms}")
    private int jwtExpirationMs;

    @Value("${cookie.secure:false}")
    private boolean cookieSecure;

    public AuthController(AuthService authService, UserContextService userContextService) {
        this.authService = authService;
        this.userContextService = userContextService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        String token = authService.login(request);
        
        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(jwtExpirationMs / 1000);
                
        if (cookieSecure) {
            cookieBuilder.sameSite("None"); // Required for cross-domain (Vercel -> Render)
        } else {
            cookieBuilder.sameSite("Lax");  // Required for local HTTP development
        }
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookieBuilder.build().toString());

        return ResponseEntity.ok(ApiResponse.success("Login successful", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0);
                
        if (cookieSecure) {
            cookieBuilder.sameSite("None");
        } else {
            cookieBuilder.sameSite("Lax");
        }
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookieBuilder.build().toString());
        
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userContextService.getCurrentUser();
                
        AuthResponse response = new AuthResponse(user.getId(), user.getUsername(), user.getEmail());
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", response));
    }
}
