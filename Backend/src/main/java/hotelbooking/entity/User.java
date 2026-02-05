package hotelbooking.entity;

import hotelbooking.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")  // Maps to "users" table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uid")  // Maps to "uid" column
    private Long id;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(unique = true, nullable = false, length = 255)
    private String email;
    
    @Column(name = "email_verification")
    private boolean emailVerified;

    // @Column(name = "verification_token", length = 255)
    // private String verificationToken;
    
    @Column(length = 20)
    private String phone;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;
    
    @Column(name = "creation_date")
    private LocalDateTime creationDate;
    
    @Column(columnDefinition = "TEXT")
    private String logs;
}