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
                Book.builder().title("1984").author("George Orwell")
                        .description("A dystopian social science fiction novel and cautionary tale.")
                        .pages(328).rating(4.8).copiesAvailable(5)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234529/1984_nq3yqa.webp")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("The Great Gatsby").author("F. Scott Fitzgerald")
                        .description("A story of wealth, love, and the American Dream.")
                        .pages(180).rating(4.4).copiesAvailable(3)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234539/greaat_gatsby_cize2a.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("To Kill a Mockingbird").author("Harper Lee")
                        .description("A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age.")
                        .pages(281).rating(4.9).copiesAvailable(4)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234539/mockingbird_se9pgv.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("The Hobbit").author("J.R.R. Tolkien")
                        .description("A great modern classic and the prelude to The Lord of the Rings.")
                        .pages(310).rating(4.8).copiesAvailable(6)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234541/the_hobit_xvmdi8.webp")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("Fahrenheit 451").author("Ray Bradbury")
                        .description("A terrifyingly prophetic novel about a post-literate future.")
                        .pages(194).rating(4.6).copiesAvailable(3)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234534/fahrenheit-451-46_rehdsg.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("Brave New World").author("Aldous Huxley")
                        .description("A searching vision of an unequal, technologically-advanced future.")
                        .pages(268).rating(4.5).copiesAvailable(3)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234531/Aldos_cqyqrt.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("Animal Farm").author("George Orwell")
                        .description("A political allegory based on the Russian Revolution.")
                        .pages(141).rating(4.7).copiesAvailable(8)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234541/animal_nvqrtg.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("The Alchemist").author("Paulo Coelho")
                        .description("A fable about following your dream.")
                        .pages(208).rating(4.7).copiesAvailable(10)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234536/The-Alchemist-001_lxgw0e.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("Lord of the Flies").author("William Golding")
                        .description("A story about a group of British boys stranded on an uninhabited island.")
                        .pages(224).rating(4.3).copiesAvailable(3)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234538/Lord_of_the_Flies_William_Golding_zkcmz7.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("The Catcher in the Rye").author("J.D. Salinger")
                        .description("A story of teenage rebellion and alienation.")
                        .pages(234).rating(4.0).copiesAvailable(2)
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234541/The_Catcher_in_the_Rye_J.D._Salinger_dgrmlb.jpg")
                        .coverColor("#5d4037").spineColor("#3e2723").build(),
                Book.builder().title("Project Hail Mary").author("Andy Weir")
                        .description("A lone astronaut must save the earth from disaster.")
                        .pages(476).rating(5.0).copiesAvailable(3).badge("EXCLUSIVE")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234545/Project_Hail_Mary_Andy_Weir_obafkm.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("Circe").author("Madeline Miller")
                        .description("A bold and subversive retelling of the goddess's story.")
                        .pages(393).rating(4.8).copiesAvailable(2).badge("PREMIUM")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234535/Circe_Madeline_Miller_mrccqj.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("Dune").author("Frank Herbert")
                        .description("The masterpiece of planetary sci-fi.")
                        .pages(412).rating(4.9).copiesAvailable(1).badge("PREMIUM")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234540/Dune_Frank_Herbert_moajut.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("Neuromancer").author("William Gibson")
                        .description("The book that defined Cyberpunk.")
                        .pages(271).rating(4.7).copiesAvailable(2).badge("PREMIUM")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234541/Neuromancer_William_Gibson_c5kg6o.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("American Gods").author("Neil Gaiman")
                        .description("A storm is coming between the old gods and the new.")
                        .pages(465).rating(4.8).copiesAvailable(2).badge("EXCLUSIVE")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234532/American_Gods_Neil_Gaiman_ozfgjf.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("A Game of Thrones").author("George R.R. Martin")
                        .description("Winter is coming.")
                        .pages(694).rating(4.9).copiesAvailable(4).badge("PREMIUM")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234530/A_Game_of_Thrones_George_R.R._Martin_vfzzay.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("Foundation").author("Isaac Asimov")
                        .description("The epic saga of the fall of a Galactic Empire.")
                        .pages(255).rating(4.8).copiesAvailable(3).badge("PREMIUM")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775235387/foundation_e9naux.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("The Name of the Wind").author("Patrick Rothfuss")
                        .description("The tale of Kvothe, the most notorious wizard.")
                        .pages(662).rating(4.9).copiesAvailable(1).badge("PREMIUM")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775234530/The_Name_of_the_Wind_cphkad.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("7 Deaths of Evelyn Hardcastle").author("Stuart Turton")
                        .description("A mind-bending time-loop murder mystery.")
                        .pages(432).rating(4.7).copiesAvailable(2).badge("EXCLUSIVE")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775236881/7_zyw4ju.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("The Shadow of the Wind").author("Carlos Ruiz Zafon")
                        .description("")
                        .pages(474).rating(4.3).copiesAvailable(6).badge("PREMIUM")
                        .imageUrl("https://res.cloudinary.com/df8aj6mzn/image/upload/v1775288991/teborveedmkpps2iuzbo.jpg")
                        .coverColor("#1a1a2e").spineColor("#0f0f1a").build(),
                Book.builder().title("Sapiens").author("Yuval Noah Harari")
                        .description("A brief history of humankind from the Stone Age to the modern era.")
                        .genre("History").published("2011")
                        .pages(443).rating(4.7).copiesAvailable(7).badge("NEW ARRIVAL")
                        .coverColor("#1D3557").spineColor("#A8DADC").build()
        );

        bookRepository.saveAll(seedBooks);
        log.info("Seeded {} default books", seedBooks.size());
    }
}
