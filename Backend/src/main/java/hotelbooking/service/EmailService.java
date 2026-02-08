package hotelbooking.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    
    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        log.info("📧 Preparing verification email for: {}", toEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Booking+ Account");
            
            String verificationLink = frontendUrl + "/verify-email?token=" + token;
            String htmlContent = loadVerificationTemplate(verificationLink, firstName);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("✅ Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", toEmail, e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        log.info("📧 Preparing password reset email for: {}", toEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject("Reset Your Booking+ Password");
            
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            String htmlContent = loadPasswordResetTemplate(resetLink, firstName);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("✅ Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            e.printStackTrace();
        }
    }

    private String loadVerificationTemplate(String verificationLink, String firstName) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/VerificationTemplate.html");
            String template = StreamUtils.copyToString(
                resource.getInputStream(), 
                StandardCharsets.UTF_8
            );
            
            log.info("✅ Verification template loaded successfully");
            
            return template
                .replace("[VERIFICATION_LINK]", verificationLink)
                .replace("[FIRST_NAME]", firstName);
                
        } catch (Exception e) {
            log.error("Failed to load verification email template: {}", e.getMessage());
            return getVerificationFallbackTemplate(verificationLink, firstName);
        }
    }

    private String loadPasswordResetTemplate(String resetLink, String firstName) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/ResetPassword.html");
            String template = StreamUtils.copyToString(
                resource.getInputStream(), 
                StandardCharsets.UTF_8
            );
            
            log.info("✅ Password reset template loaded successfully");
            
            return template
                .replace("[RESET_LINK]", resetLink)
                .replace("[FIRST_NAME]", firstName);
                
        } catch (Exception e) {
            log.error("Failed to load password reset email template: {}", e.getMessage());
            return getPasswordResetFallbackTemplate(resetLink, firstName);
        }
    }
    
    private String getVerificationFallbackTemplate(String verificationLink, String firstName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h1>Hello %s</h1>
                <p>Welcome to Booking+!</p>
                <p>Please click the link below to verify your email address:</p>
                <a href="%s" style="background-color: #8B0000; color: #D4AF37; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 4px;">Verify Email</a>
                <p>Or copy this link: %s</p>
                <p>This link will expire in 12 hours.</p>
                <p>Best regards,<br>The Booking+ Team</p>
            </body>
            </html>
            """.formatted(firstName, verificationLink, verificationLink);
    }

    private String getPasswordResetFallbackTemplate(String resetLink, String firstName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h1>Hello %s</h1>
                <p>We received a request to reset your Booking+ password.</p>
                <p>Please click the link below to reset your password:</p>
                <a href="%s" style="background-color: #8B0000; color: #D4AF37; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 4px;">Reset Password</a>
                <p>Or copy this link: %s</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>The Booking+ Team</p>
            </body>
            </html>
            """.formatted(firstName, resetLink, resetLink);
    }

    public void logVerificationToken(String email, String token) {
        String verificationLink = frontendUrl + "/verify-email?token=" + token;
        log.info("🔗 [DEBUG] Verification link for {}: {}", email, verificationLink);
        log.info("🔑 [DEBUG] Verification token: {}", token);
    }
}