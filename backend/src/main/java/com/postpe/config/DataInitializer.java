package com.postpe.config;

import com.postpe.entity.Category;
import com.postpe.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (categoryRepository.count() > 0) return;

        List<Category> categories = List.of(
            Category.builder().name("Cars").slug("cars").iconName("car").displayOrder(1).build(),
            Category.builder().name("Bikes").slug("bikes").iconName("bike").displayOrder(2).build(),
            Category.builder().name("Other Vehicles").slug("other-vehicles").iconName("truck").displayOrder(3).build(),
            Category.builder().name("Mobiles & Electronics").slug("mobiles-electronics").iconName("smartphone").displayOrder(4).build(),
            Category.builder().name("Jobs").slug("jobs").iconName("briefcase").displayOrder(5).build(),
            Category.builder().name("Real Estate").slug("real-estate").iconName("building-2").displayOrder(6).build(),
            Category.builder().name("Hotel / PG").slug("hotel-pg").iconName("hotel").displayOrder(7).build(),
            Category.builder().name("Furniture & Home").slug("furniture-home").iconName("sofa").displayOrder(8).build(),
            Category.builder().name("Carpool / Travel").slug("carpool-travel").iconName("car-taxi-front").displayOrder(9).build(),
            Category.builder().name("Animals & Pets").slug("animals-pets").iconName("paw-print").displayOrder(10).build(),
            Category.builder().name("Fashion & Beauty").slug("fashion-beauty").iconName("shirt").displayOrder(11).build(),
            Category.builder().name("Books & Education").slug("books-education").iconName("book-open").displayOrder(12).build(),
            Category.builder().name("Events & Promotions").slug("events-promotions").iconName("calendar").displayOrder(13).build(),
            Category.builder().name("Home Services").slug("home-services").iconName("wrench").displayOrder(14).build(),
            Category.builder().name("Software & IT").slug("software-it").iconName("monitor").displayOrder(15).build(),
            Category.builder().name("Business").slug("business").iconName("chart-line").displayOrder(16).build(),
            Category.builder().name("Others").slug("others").iconName("folder").displayOrder(17).build()
        );

        categoryRepository.saveAll(categories);
    }
}
