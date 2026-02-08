package hotelbooking.controller;

import hotelbooking.dto.request.LoginRequest;
import hotelbooking.dto.request.RegisterRequest;
import hotelbooking.dto.response.ApiResponse;
import hotelbooking.dto.response.AuthResponse;
import hotelbooking.exception.*;

import hotelbooking.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")

public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new customer account")

    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        
        AuthResponse response = authService.register(request);

        log.info("User registered successfully: {}", response.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/check-email")
    @Operation(summary = "Check email availability", description = "Check if email is already registered")
    
    public ResponseEntity<ApiResponse> checkEmail(@RequestParam String email) {
        boolean exists = authService.emailExists(email);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(!exists)
                .message(exists ? "Email already registered" : "Email available")
                .data(exists)
                .build());
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and return JWT token")
    
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        AuthResponse response = authService.login(request);
        
        log.info("User logged in successfully: {}", response.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify user email with token")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) {
        log.info("Email verification request for token: {}", token);
    
        try {
            authService.verifyEmail(token);
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Email verified successfully!")
                    .timestamp(LocalDateTime.now())
                    .build());
                    
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend verification email", description = "Resend verification email to user")
    public ResponseEntity<ApiResponse> resendVerification(@RequestBody Map<String, String> request) {
        log.info("Resend verification request");
        
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Email is required")
                            .timestamp(LocalDateTime.now())
                            .build());
        }
        
        try {
            authService.resendVerificationEmail(email);
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Verification email sent successfully!")
                    .timestamp(LocalDateTime.now())
                    .build());
                    
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }
}
