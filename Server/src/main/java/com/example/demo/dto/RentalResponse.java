package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RentalResponse {
    private Long id;
    private String username;
    private String bookTitle;
    private String bookAuthor;
    private String coverColor;
    private LocalDate rentalDate;
    private LocalDate returnDate;
    private String collectionCode;
    private LocalDateTime pickupDeadline;
    private String status;
}