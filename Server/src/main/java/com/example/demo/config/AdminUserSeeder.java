package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminUserSeeder implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@library.com";
    private static final String ADMIN_PASSWORD = "admin123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Optional<User> existingAdmin = userRepository.findByEmail(ADMIN_EMAIL);
        if (existingAdmin.isPresent()) {
            User user = existingAdmin.get();
            boolean changed = false;

            if (user.getRole() != User.Role.ADMIN) {
                user.setRole(User.Role.ADMIN);
                changed = true;
            }

            if (!passwordEncoder.matches(ADMIN_PASSWORD, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                changed = true;
            }

            if (changed) {
                userRepository.save(user);
                log.info("Updated existing admin user credentials for: {}", ADMIN_EMAIL);
            }
            return;
        }

        User admin = User.builder()
                .name("Admin")
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(User.Role.ADMIN)
                .build();

        userRepository.save(admin);
        log.info("Seeded default admin user: {}", ADMIN_EMAIL);
    }
}
