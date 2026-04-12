package com.example.demo.config;

import com.example.demo.entity.Book;
import com.example.demo.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Override
    public void run(String... args) {
        if (bookRepository.count() > 0) {
            return;
        }

        List<Book> seedBooks = List.of(
                Book.builder()
                        .title("The Hobbit")
                        .author("J.R.R. Tolkien")
                        .description("A fantasy adventure about Bilbo Baggins and a quest to reclaim a lost dwarf kingdom.")
                        .genre("Fantasy")
                        .published("1937")
                        .pages(310)
                        .rating(4.8)
                        .copiesAvailable(6)
                        .badge("BESTSELLER")
                        .coverColor("#355070")
                        .spineColor("#EAAC8B")
                        .build(),
                Book.builder()
                        .title("Atomic Habits")
                        .author("James Clear")
                        .description("A practical framework for building good habits and breaking bad ones.")
                        .genre("Self-help")
                        .published("2018")
                        .pages(320)
                        .rating(4.7)
                        .copiesAvailable(8)
                        .badge("EDITOR'S PICK")
                        .coverColor("#6D597A")
                        .spineColor("#F4A261")
                        .build(),
                Book.builder()
                        .title("Clean Code")
                        .author("Robert C. Martin")
                        .description("A handbook of agile software craftsmanship with practical coding principles.")
                        .genre("Technology")
                        .published("2008")
                        .pages(464)
                        .rating(4.6)
                        .copiesAvailable(5)
                        .badge("PREMIUM EXCLUSIVE")
                        .coverColor("#264653")
                        .spineColor("#E9C46A")
                        .build(),
                Book.builder()
                        .title("Sapiens")
                        .author("Yuval Noah Harari")
                        .description("A brief history of humankind from the Stone Age to the modern era.")
                        .genre("History")
                        .published("2011")
                        .pages(443)
                        .rating(4.7)
                        .copiesAvailable(7)
                        .badge("NEW ARRIVAL")
                        .coverColor("#1D3557")
                        .spineColor("#A8DADC")
                        .build()
        );

        bookRepository.saveAll(seedBooks);
        log.info("Seeded {} default books", seedBooks.size());
    }
}
