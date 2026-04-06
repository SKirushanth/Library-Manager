package com.example.demo.repository;

import com.example.demo.entity.Rental;
import com.example.demo.entity.Book;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUser(User user);

    List<Rental> findByUserOrderByRentalDateDesc(User user);

    List<Rental> findByUserAndStatusIn(User user, Collection<Rental.RentalStatus> statuses);

    List<Rental> findByStatusIn(Collection<Rental.RentalStatus> statuses);

    boolean existsByUserAndBookAndStatusIn(User user, Book book, Collection<Rental.RentalStatus> statuses);

    long countByUserAndStatusIn(User user, Collection<Rental.RentalStatus> statuses);

    boolean existsByCollectionCode(String collectionCode);

    Optional<Rental> findByUserAndBookAndStatus(User user, Book book, Rental.RentalStatus status);
}