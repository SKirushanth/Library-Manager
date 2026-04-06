package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String genre;
    private String published;
    private int pages;
    private double rating;

    @Column(nullable = false)
    private int copiesAvailable;

    // The new field for Cloudinary
    @Column(name = "image_url")
    private String imageUrl;

    private String badge;
    private String coverColor;
    private String spineColor;
}