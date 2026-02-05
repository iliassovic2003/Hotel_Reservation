package hotelbooking.service;

import hotelbooking.dto.request.LoginRequest;
import hotelbooking.dto.request.RegisterRequest;
import hotelbooking.dto.response.AuthResponse;
import hotelbooking.entity.User;
import hotelbooking.entity.enums.Role;
import hotelbooking.exception.BadRequestException;
import hotelbooking.exception.UnauthorizedException;
import hotelbooking.repository.UserRepository;
import hotelbooking.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        log.info("=== REGISTRATION STARTED ===");
        log.info("Registering user with email: {}", request.getEmail());
        log.info("Request data - First Name: {}, Last Name: {}, Email: {}", 
            request.getFname(), request.getLname(), request.getEmail());
        
        // Check if email already exists
        log.info("Checking if email exists: {}", request.getEmail());
        if (emailExists(request.getEmail())) {
            log.error("❌ Registration failed - Email already registered: {}", request.getEmail());
            throw new BadRequestException("Email already registered");
        }
        log.info("✅ Email is available");

        // Validate password confirmation
        log.info("Validating password confirmation");
        if (request.getPassword2() != null && 
            !request.getPassword().equals(request.getPassword2())) {
            log.error("❌ Registration failed - Passwords do not match");
            throw new BadRequestException("Passwords do not match");
        }
        log.info("✅ Passwords match");

        // Create user
        log.info("Creating User object...");
        User user = User.builder()
                .firstName(request.getFname())
                .lastName(request.getLname())
                .email(request.getEmail().toLowerCase())
                .emailVerified(false)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .creationDate(LocalDateTime.now())
                .logs("Account created on " + LocalDateTime.now())
                .build();
        log.info("✅ User object created");

        // Save user
        log.info("Saving user to database...");
        User savedUser = userRepository.save(user);
        log.info("✅ User saved successfully with ID: {}", savedUser.getId());

        // Create response
        log.info("Creating response...");
        AuthResponse response = AuthResponse.builder()
                .message("Registration successful. Please verify your email.")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole().name())
                .emailVerified(savedUser.isEmailVerified())
                .build();
        
        log.info("=== REGISTRATION COMPLETED SUCCESSFULLY ===");
        log.info("Response: {}", response);
        return response;
    }

    public boolean emailExists(String email) {
        boolean exists = userRepository.existsByEmail(email.toLowerCase());
        log.debug("Email exists check for '{}': {}", email, exists);
        return exists;
    }

    public AuthResponse login(LoginRequest request) {
        log.info("=== LOGIN ATTEMPT ===");
        log.info("Login attempt for email: {}", request.getEmail());
        
        log.info("Looking for user with email: {}", request.getEmail());
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> {
                    log.error("❌ Login failed - User not found: {}", request.getEmail());
                    return new UnauthorizedException("Invalid email or password");
                });
        log.info("✅ User found: {} {}", user.getFirstName(), user.getLastName());

        log.info("Verifying password...");
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("❌ Login failed - Invalid password for user: {}", request.getEmail());
            user.setLogs(user.getLogs() + "\nFailed login: " + LocalDateTime.now());
            userRepository.save(user);
            throw new UnauthorizedException("Invalid email or password");
        }
        log.info("✅ Password verified successfully");

        if (!user.isEmailVerified()) {
            log.warn("⚠️ User email not verified: {}", request.getEmail());
            // Comment this out if you want to allow login without email verification
            // throw new BadRequestException("Please verify your email before logging in");
        }
        
        // Update user logs
        user.setLogs(user.getLogs() + "\nSuccessful login: " + LocalDateTime.now());
        userRepository.save(user);
        log.info("✅ User logs updated");
        
        // Generate JWT token
        log.info("Generating JWT token...");
        String token = jwtTokenProvider.generateToken(user.getEmail());
        log.info("✅ JWT token generated");

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .message("Login successful")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .emailVerified(user.isEmailVerified())
                .build();
        
        log.info("=== LOGIN SUCCESSFUL ===");
        log.info("Response with token for user: {}", user.getEmail());
        return response;
    }
    
    public void verifyEmail(String token) {
        log.info("Email verification requested with token: {}", token);
        throw new BadRequestException("Email verification not yet implemented");
    }
}