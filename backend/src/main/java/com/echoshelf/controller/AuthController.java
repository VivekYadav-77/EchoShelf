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
import org.springframework.http.HttpStatus;
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
        
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure); // Configurable based on env
        cookie.setPath("/");
        cookie.setMaxAge(jwtExpirationMs / 1000);
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success("Login successful", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
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
