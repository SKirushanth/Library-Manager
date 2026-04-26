package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
@Profile("!prod")
@RequiredArgsConstructor
public class AdminUserSeeder implements CommandLineRunner {

    @Value("${APP_SEED_ADMIN_EMAIL:admin@library.com}")
    private String adminEmail;

    @Value("${APP_SEED_ADMIN_PASSWORD:admin123}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminPassword == null || adminPassword.isBlank()) {
            log.warn("Skipping admin seed because APP_SEED_ADMIN_PASSWORD is missing or blank");
            return;
        }

        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
        if (existingAdmin.isPresent()) {
            User user = existingAdmin.get();
            if (user.getRole() != User.Role.ADMIN) {
                user.setRole(User.Role.ADMIN);
                userRepository.save(user);
                log.info("Updated existing admin user role for: {}", adminEmail);
            }
            return;
        }

        User admin = User.builder()
                .name("Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(User.Role.ADMIN)
                .build();

        userRepository.save(admin);
        log.info("Seeded default admin user: {}", adminEmail);
    }
}
