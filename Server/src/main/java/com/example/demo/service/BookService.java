package com.example.demo.service;

import com.example.demo.entity.Book;
import com.example.demo.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public List<Book> searchBooks(String query) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query);
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updated) {
        Book book = getBookById(id);
        book.setTitle(updated.getTitle());
        book.setAuthor(updated.getAuthor());
        book.setDescription(updated.getDescription());
        book.setGenre(updated.getGenre());
        book.setPublished(updated.getPublished());
        book.setPages(updated.getPages());
        book.setRating(updated.getRating());
        book.setCopiesAvailable(updated.getCopiesAvailable());
        book.setImageUrl(updated.getImageUrl());
        book.setBadge(updated.getBadge());
        book.setCoverColor(updated.getCoverColor());
        book.setSpineColor(updated.getSpineColor());
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}