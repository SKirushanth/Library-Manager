package com.example.demo.service;

import com.example.demo.dto.RentalResponse;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RentalService {

    private static final EnumSet<Rental.RentalStatus> NON_RETURNED_STATUSES = EnumSet.of(
            Rental.RentalStatus.RESERVED,
            Rental.RentalStatus.PICKED_UP,
            Rental.RentalStatus.OVERDUE,
            Rental.RentalStatus.ACTIVE);

    private static final EnumSet<Rental.RentalStatus> TRACKED_FOR_OVERDUE = EnumSet.of(
            Rental.RentalStatus.RESERVED,
            Rental.RentalStatus.PICKED_UP,
            Rental.RentalStatus.OVERDUE,
            Rental.RentalStatus.ACTIVE);

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public RentalResponse rentBook(Long bookId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        refreshOverdueStatusesForUser(user);

        List<Rental> userOpenRentals = rentalRepository.findByUserAndStatusIn(user, NON_RETURNED_STATUSES);

        boolean alreadyRented = userOpenRentals.stream().anyMatch(rental -> rental.getBook() != null
                && rental.getBook().getId() != null
                && rental.getBook().getId().equals(bookId)
                && isBlockingRental(rental));

        if (alreadyRented) {
            throw new RuntimeException("You already have an active rental for this book");
        }

        long activeRentals = userOpenRentals.stream().filter(this::isBlockingRental).count();
        if (activeRentals >= 3) {
            throw new RuntimeException("Rental limit reached");
        }

        if (book.getCopiesAvailable() <= 0) {
            throw new RuntimeException("No copies available");
        }

        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);

        LocalDateTime reservationTime = LocalDateTime.now();

        Rental rental = Rental.builder()
                .user(user)
                .book(book)
                .rentalDate(reservationTime.toLocalDate())
                .returnDate(null)
                .collectionCode(generateCollectionCode())
                .pickupDeadline(reservationTime.plusHours(24))
                .inventoryReleased(false)
                .status(Rental.RentalStatus.RESERVED)
                .build();

        rentalRepository.save(rental);
        emailService.sendRentalConfirmation(user.getEmail(), user.getName(), book.getTitle());

        log.info("Reservation created for {} and '{}', pickup code {}", userEmail, book.getTitle(),
                rental.getCollectionCode());

        return mapToResponse(rental);
    }

    public List<RentalResponse> getUserRentals(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        refreshOverdueStatusesForUser(user);

        return rentalRepository.findByUserOrderByRentalDateDesc(user)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<RentalResponse> getAllRentals() {
        refreshOverdueStatuses();

        return rentalRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public RentalResponse confirmPickup(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        Rental.RentalStatus currentStatus = refreshOverdueStatus(rental);

        if (currentStatus == Rental.RentalStatus.RETURNED) {
            throw new RuntimeException("Book already returned");
        }
        if (currentStatus == Rental.RentalStatus.OVERDUE) {
            throw new RuntimeException("Reservation window expired");
        }
        if (currentStatus != Rental.RentalStatus.RESERVED) {
            throw new RuntimeException("Pickup already confirmed");
        }

        LocalDate pickupDate = LocalDate.now();
        rental.setStatus(Rental.RentalStatus.PICKED_UP);
        rental.setRentalDate(pickupDate);
        rental.setReturnDate(pickupDate.plusDays(14));
        rental.setInventoryReleased(false);
        rentalRepository.save(rental);

        log.info("Pickup confirmed for rental {} (code {})", rentalId, rental.getCollectionCode());

        return mapToResponse(rental);
    }

    public RentalResponse returnBook(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        Rental.RentalStatus currentStatus = refreshOverdueStatus(rental);

        if (currentStatus == Rental.RentalStatus.RETURNED) {
            throw new RuntimeException("Book already returned");
        }

        rental.setStatus(Rental.RentalStatus.RETURNED);
        rental.setReturnDate(LocalDate.now());

        if (!rental.isInventoryReleased()) {
            Book book = rental.getBook();
            book.setCopiesAvailable(book.getCopiesAvailable() + 1);
            bookRepository.save(book);
            rental.setInventoryReleased(true);
        }

        rentalRepository.save(rental);

        log.info("Rental {} marked as returned", rentalId);

        return mapToResponse(rental);
    }

    private Rental.RentalStatus refreshOverdueStatus(Rental rental) {
        boolean changed = false;
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        if (rental.getStatus() == Rental.RentalStatus.ACTIVE) {
            rental.setStatus(Rental.RentalStatus.PICKED_UP);
            changed = true;
        }

        if (rental.getStatus() == Rental.RentalStatus.RESERVED
                && rental.getPickupDeadline() != null
                && rental.getPickupDeadline().isBefore(now)) {
            rental.setStatus(Rental.RentalStatus.OVERDUE);
            releaseInventoryForExpiredReservation(rental);
            changed = true;
        }

        if (rental.getStatus() == Rental.RentalStatus.OVERDUE
                && rental.getReturnDate() == null
                && !rental.isInventoryReleased()) {
            releaseInventoryForExpiredReservation(rental);
            changed = true;
        }

        if (rental.getStatus() == Rental.RentalStatus.PICKED_UP
                && rental.getReturnDate() != null
                && rental.getReturnDate().isBefore(today)) {
            rental.setStatus(Rental.RentalStatus.OVERDUE);
            changed = true;
        }

        if (changed) {
            rentalRepository.save(rental);
        }

        return rental.getStatus();
    }

    private void refreshOverdueStatusesForUser(User user) {
        List<Rental> rentals = rentalRepository.findByUserAndStatusIn(user, TRACKED_FOR_OVERDUE);
        refreshOverdueStatuses(rentals);
    }

    private void refreshOverdueStatuses() {
        List<Rental> rentals = rentalRepository.findByStatusIn(TRACKED_FOR_OVERDUE);
        refreshOverdueStatuses(rentals);
    }

    private void refreshOverdueStatuses(List<Rental> rentals) {
        if (rentals.isEmpty()) {
            return;
        }

        boolean changed = false;
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        for (Rental rental : rentals) {
            if (rental.getStatus() == Rental.RentalStatus.ACTIVE) {
                rental.setStatus(Rental.RentalStatus.PICKED_UP);
                changed = true;
            }

            if (rental.getStatus() == Rental.RentalStatus.RESERVED
                    && rental.getPickupDeadline() != null
                    && rental.getPickupDeadline().isBefore(now)) {
                rental.setStatus(Rental.RentalStatus.OVERDUE);
                releaseInventoryForExpiredReservation(rental);
                changed = true;
            }

            if (rental.getStatus() == Rental.RentalStatus.OVERDUE
                    && rental.getReturnDate() == null
                    && !rental.isInventoryReleased()) {
                releaseInventoryForExpiredReservation(rental);
                changed = true;
            }

            if (rental.getStatus() == Rental.RentalStatus.PICKED_UP
                    && rental.getReturnDate() != null
                    && rental.getReturnDate().isBefore(today)) {
                rental.setStatus(Rental.RentalStatus.OVERDUE);
                changed = true;
            }
        }

        if (changed) {
            rentalRepository.saveAll(rentals);
        }
    }

    private String generateCollectionCode() {
        String code;
        do {
            code = "RN-" + ThreadLocalRandom.current().nextInt(1000, 10000);
        } while (rentalRepository.existsByCollectionCode(code));

        return code;
    }

    private boolean isBlockingRental(Rental rental) {
        Rental.RentalStatus status = rental.getStatus();
        if (status == null) {
            return false;
        }

        return switch (status) {
            case RESERVED, PICKED_UP, ACTIVE -> true;
            case OVERDUE -> !rental.isInventoryReleased();
            case RETURNED -> false;
        };
    }

    private void releaseInventoryForExpiredReservation(Rental rental) {
        if (rental.isInventoryReleased()) {
            return;
        }

        Book book = rental.getBook();
        if (book != null) {
            book.setCopiesAvailable(book.getCopiesAvailable() + 1);
            bookRepository.save(book);
        }

        rental.setInventoryReleased(true);
    }

    private RentalResponse mapToResponse(Rental rental) {
        String username = "User";
        if (rental.getUser() != null) {
            username = rental.getUser().getName() != null && !rental.getUser().getName().isBlank()
                    ? rental.getUser().getName()
                    : rental.getUser().getEmail();
        }

        Rental.RentalStatus currentStatus = rental.getStatus() == null
                ? Rental.RentalStatus.RESERVED
                : rental.getStatus();

        String status = currentStatus == Rental.RentalStatus.ACTIVE
                ? Rental.RentalStatus.PICKED_UP.name()
                : currentStatus.name();

        return new RentalResponse(
                rental.getId(),
                username,
                rental.getBook().getTitle(),
                rental.getBook().getAuthor(),
                rental.getBook().getCoverColor(),
                rental.getRentalDate(),
                rental.getReturnDate(),
                rental.getCollectionCode(),
                rental.getPickupDeadline(),
                status);
    }
}