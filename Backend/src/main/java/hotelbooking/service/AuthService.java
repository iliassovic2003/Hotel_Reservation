package hotelbooking.service;

import hotelbooking.dto.request.LoginRequest;
import hotelbooking.dto.request.RegisterRequest;
import hotelbooking.dto.response.AuthResponse;
import hotelbooking.entity.User;
import hotelbooking.entity.enums.Role;
import hotelbooking.entity.RefreshToken;
import hotelbooking.exception.BadRequestException;
import hotelbooking.exception.ResourceNotFoundException;
import hotelbooking.exception.UnauthorizedException;
import hotelbooking.repository.UserRepository;
import hotelbooking.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;

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
        String verificationToken = UUID.randomUUID().toString();
        User user = User.builder()
                .firstName(request.getFname())
                .lastName(request.getLname())
                .email(request.getEmail().toLowerCase())
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(Instant.now().plus(12, ChronoUnit.HOURS))
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .creationDate(Instant.now())
                .logs("Account created on " + Instant.now())
                .build();
        log.info("✅ User object created");

        // Save user
        log.info("Saving user to database...");
        User savedUser = userRepository.save(user);
        log.info("✅ User saved successfully with ID: {}", savedUser.getId());

        emailService.sendVerificationEmail(
            savedUser.getEmail(), 
            savedUser.getFirstName(), 
            verificationToken
        );

        emailService.logVerificationToken(savedUser.getEmail(), verificationToken);

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
            user.setLogs(user.getLogs() + "\nFailed login: " + Instant.now());
            userRepository.save(user);
            throw new UnauthorizedException("Invalid email or password");
        }
        log.info("✅ Password verified successfully");

        if (!user.isEmailVerified()) {
            log.warn("⚠️ User email not verified: {}", request.getEmail());
            throw new BadRequestException("Please verify your email before logging in");
        }
        
        // Update user logs
        user.setLogs(user.getLogs() + "\nSuccessful login: " + Instant.now());
        userRepository.save(user);
        log.info("✅ User logs updated");
        
        // Generate JWT token
        log.info("Generating JWT token...");
        String accessToken = jwtTokenProvider.generateToken(user.getEmail());
        log.info("✅ JWT token generated");

        log.info("Generating refresh token...");
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        log.info("✅ Refresh token generated");

        AuthResponse response = AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken.getToken())
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
        log.info("=== EMAIL VERIFICATION STARTED ===");
        log.info("Verifying token: {}", token);
        
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> {
                    log.error("❌ Invalid verification token: {}", token);
                    return new BadRequestException("Invalid verification token");
                });
        
        log.info("✅ Found user: {} {} ({})", 
            user.getFirstName(), user.getLastName(), user.getEmail());
        
        if (user.isEmailVerified()) {
            log.info("✅ User already verified: {}", user.getEmail());
            return;
        }
        
        if (user.getVerificationTokenExpiry() != null && 
            user.getVerificationTokenExpiry().isBefore(Instant.now())) {
            log.error("❌ Verification token expired for: {}", user.getEmail());
            throw new BadRequestException("Verification token has expired. Please request a new one.");
        }
        
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        user.setLogs(user.getLogs() + "\nEmail verified: " + Instant.now());
        
        userRepository.save(user);
        
        log.info("✅ Email successfully verified for: {}", user.getEmail());
        log.info("=== EMAIL VERIFICATION COMPLETED ===");
    }
    
    public void resendVerificationEmail(String email) {
        log.info("=== RESEND VERIFICATION EMAIL STARTED ===");
        log.info("Resending verification email to: {}", email);
        
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> {
                    log.error("❌ User not found: {}", email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });
        
        log.info("✅ Found user: {} {} ({})", 
            user.getFirstName(), user.getLastName(), user.getEmail());
        
        if (user.isEmailVerified()) {
            log.warn("⚠️ User email already verified: {}", email);
            throw new BadRequestException("Email is already verified");
        }
        
        // Generate new verification token
        String newVerificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(newVerificationToken);
        user.setVerificationTokenExpiry(Instant.now().plus(12, ChronoUnit.HOURS));
        user.setLogs(user.getLogs() + "\nVerification email resent: " + Instant.now());
        
        userRepository.save(user);
        
        // Send verification email
        emailService.sendVerificationEmail(
            user.getEmail(),
            user.getFirstName(),
            newVerificationToken
        );
        
        emailService.logVerificationToken(user.getEmail(), newVerificationToken);
        
        log.info("✅ Verification email resent to: {}", user.getEmail());
        log.info("🔑 [DEBUG] New verification token: {}", newVerificationToken);
        log.info("=== RESEND VERIFICATION EMAIL COMPLETED ===");
    }

    public AuthResponse refreshAccessToken(String refreshTokenString) {
        log.info("=== REFRESH TOKEN REQUEST ===");
        
        try {
            // Find and verify refresh token
            RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenString);
            refreshTokenService.verifyExpiration(refreshToken);
            
            User user = refreshToken.getUser();
            log.info("Refreshing access token for user: {}", user.getEmail());
            
            // Generate new ACCESS token
            String newAccessToken = jwtTokenProvider.generateToken(user.getEmail());
            
            // Generate new refresh token (token rotation)
            RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
            
            // Delete old refresh token
            refreshTokenService.deleteByUser(user);

            log.info("✅ Access token refreshed successfully for user: {}", user.getEmail());

            // ✅ Create response INSIDE the try block
            AuthResponse response = AuthResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(newRefreshToken.getToken())
                    .tokenType("Bearer")
                    .message("Token refreshed successfully")
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole().name())
                    .emailVerified(user.isEmailVerified())
                    .build();
            
            log.info("✅ Access token refreshed");
            return response;  // ✅ Return inside try block
            
        } catch (BadRequestException e) {
            if (e.getMessage().equals("REFRESH_TOKEN_EXPIRED")) {
                log.warn("Refresh token expired - user must login again");
                
                try {
                    String email = jwtTokenProvider.getEmailFromToken(refreshTokenString);
                    log.info("Expired refresh token belonged to user: {}", email);
                } catch (Exception ex) {
                    log.debug("Could not extract email from expired token");
                }
                throw new BadRequestException("REFRESH_TOKEN_EXPIRED");
            }
            throw e;
        }
    }

    public void logout(String email) {
        log.info("Logging out user: {}", email);
    
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        refreshTokenService.deleteByUser(user);
        
        user.setLogs(user.getLogs() + "\nLogged out from all devices: " + Instant.now());
        userRepository.save(user);
        
        log.info("✅ User logged out successfully: {}", email);
    }
}