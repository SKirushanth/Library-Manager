package com.example.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    public void sendRentalConfirmation(String toEmail, String userName, String bookTitle) {
        // Email disabled — log only
        log.info("📧 [EMAIL DISABLED] Rental confirmation for '{}' would be sent to {}", bookTitle, toEmail);
    }
}