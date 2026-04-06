package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rentals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private LocalDate rentalDate;
    private LocalDate returnDate;
    private String collectionCode;
    private LocalDateTime pickupDeadline;
    private boolean inventoryReleased;

    @Enumerated(EnumType.STRING)
    private RentalStatus status;

    public enum RentalStatus {
        RESERVED,
        PICKED_UP,
        RETURNED,
        OVERDUE,
        ACTIVE
    }
}