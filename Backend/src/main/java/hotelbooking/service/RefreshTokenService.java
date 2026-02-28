package hotelbooking.service;

import hotelbooking.entity.RefreshToken;
import hotelbooking.entity.User;
import hotelbooking.exception.BadRequestException;
import hotelbooking.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {
    
    private final RefreshTokenRepository refreshTokenRepository;
    
    @Value("${app.jwt.refresh-expiration:604800000}") // 7 days in milliseconds
    private Long refreshTokenDurationMs;

    public RefreshToken createRefreshToken(User user) {
        log.info("Creating refresh token for user: {}", user.getEmail());
        refreshTokenRepository.deleteByUser(user);
        
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .createdDate(Instant.now())
                .build();
        
        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        log.info("✅ Refresh token created for user: {}", user.getEmail());
        
        return saved;
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    log.warn("Refresh token not found in database: {}", token);
                    throw new BadRequestException("REFRESH_TOKEN_INVALID");
                });
    }
    
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            log.warn("Refresh token expired for user: {} at {}", token.getUser().getEmail(), token.getExpiryDate());
            
            refreshTokenRepository.delete(token);
            throw new BadRequestException("REFRESH_TOKEN_EXPIRED");
        }
        
        return token;
    }
    
    @Transactional
    public void deleteByUser(User user) {
        log.info("Deleting all refresh tokens for user: {}", user.getEmail());
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void deleteExpiredTokens() {
        log.info("Cleaning up expired refresh tokens...");
        int deletedCount = refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
        log.info("✅ Cleaned up {} expired tokens", deletedCount);
    }
}