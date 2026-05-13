package com.smartcity.traveller.config;

import com.smartcity.traveller.entity.Listing;
import com.smartcity.traveller.entity.User;
import com.smartcity.traveller.repository.ListingRepository;
import com.smartcity.traveller.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (listingRepository.count() == 0) {
            seedListings();
        }
    }

    private void seedUsers() {
        User admin = User.builder()
                .name("Admin User")
                .email("admin@smartcitytraveller.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .build();
        userRepository.save(admin);

        User user = User.builder()
                .name("John Doe")
                .email("john@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(User.Role.USER)
                .build();
        userRepository.save(user);

        log.info("Seeded default users. Admin: admin@smartcitytraveller.com / admin123");
    }

    private void seedListings() {
        List<Listing> listings = List.of(
            Listing.builder().type(Listing.ListingType.HOTEL).title("The Grand Palace Hotel")
                .location("Paris, France").description("Experience luxury in the heart of Paris with breathtaking views of the Eiffel Tower.")
                .price(new BigDecimal("289.00")).images(List.of(
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"))
                .rating(new BigDecimal("4.8")).reviewCount(342).amenities("WiFi,Pool,Spa,Restaurant,Gym")
                .maxGuests(2).available(true).highlights("City View,Free Breakfast,Concierge").category("Luxury").build(),

            Listing.builder().type(Listing.ListingType.HOTEL).title("Bali Eco Resort & Spa")
                .location("Bali, Indonesia").description("Immerse yourself in nature with our stunning eco-resort surrounded by rice terraces.")
                .price(new BigDecimal("145.00")).images(List.of(
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"))
                .rating(new BigDecimal("4.9")).reviewCount(520).amenities("WiFi,Pool,Yoga,Spa,Organic Restaurant")
                .maxGuests(2).available(true).highlights("Rice Terrace View,Infinity Pool,Wellness").category("Eco").build(),

            Listing.builder().type(Listing.ListingType.HOTEL).title("Manhattan Skyline Hotel")
                .location("New York, USA").description("Modern boutique hotel in the heart of Manhattan with stunning skyline views.")
                .price(new BigDecimal("350.00")).images(List.of(
                    "https://images.unsplash.com/photo-1544124065-34f45aa3d1e3?w=800",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"))
                .rating(new BigDecimal("4.7")).reviewCount(289).amenities("WiFi,Gym,Bar,Rooftop Terrace")
                .maxGuests(2).available(true).highlights("Times Square 5min,Skyline View").category("Boutique").build(),

            Listing.builder().type(Listing.ListingType.FLIGHT).title("Paris → Tokyo Business Class")
                .location("CDG → HND").description("Non-stop business class flight with lie-flat seats and gourmet dining.")
                .price(new BigDecimal("1250.00")).images(List.of(
                    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"))
                .rating(new BigDecimal("4.6")).reviewCount(150).amenities("Business Class,Lounge Access,Priority Boarding")
                .maxGuests(1).available(true).highlights("Direct Flight,14h,Lie-flat Seats").category("Business").build(),

            Listing.builder().type(Listing.ListingType.FLIGHT).title("NYC → London Economy Plus")
                .location("JFK → LHR").description("Comfortable economy plus experience with extra legroom and complimentary meals.")
                .price(new BigDecimal("520.00")).images(List.of(
                    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"))
                .rating(new BigDecimal("4.3")).reviewCount(890).amenities("Extra Legroom,Meals Included,Entertainment")
                .maxGuests(1).available(true).highlights("7h Flight,Morning Departure").category("Economy Plus").build(),

            Listing.builder().type(Listing.ListingType.FLIGHT).title("Dubai → Sydney First Class")
                .location("DXB → SYD").description("Ultimate luxury travel experience with first class suite and award-winning service.")
                .price(new BigDecimal("3800.00")).images(List.of(
                    "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800"))
                .rating(new BigDecimal("5.0")).reviewCount(78).amenities("First Class Suite,Onboard Shower,Private Bar")
                .maxGuests(1).available(true).highlights("Private Suite,Shower Spa,14h").category("First Class").build(),

            Listing.builder().type(Listing.ListingType.TOUR).title("Tuscany Wine & Gastronomy Tour")
                .location("Florence, Italy").description("5-day immersive culinary journey through Tuscany's finest vineyards and restaurants.")
                .price(new BigDecimal("195.00")).images(List.of(
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800"))
                .rating(new BigDecimal("4.9")).reviewCount(234).amenities("Guide,Wine Tasting,Meals,Transport")
                .maxGuests(12).available(true).highlights("5 Days,Small Group,Expert Sommelier").category("Culinary").build(),

            Listing.builder().type(Listing.ListingType.TOUR).title("Tokyo Hidden Gems City Tour")
                .location("Tokyo, Japan").description("Discover Tokyo's secret neighborhoods, street food scene and traditional culture.")
                .price(new BigDecimal("89.00")).images(List.of(
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800"))
                .rating(new BigDecimal("4.8")).reviewCount(456).amenities("Local Guide,Street Food,Metro Pass")
                .maxGuests(8).available(true).highlights("8h Tour,Local Guide,Street Food").category("Cultural").build(),

            Listing.builder().type(Listing.ListingType.TOUR).title("Amazon Rainforest Adventure")
                .location("Manaus, Brazil").description("3-day eco-adventure deep into the Amazon rainforest with expert naturalist guides.")
                .price(new BigDecimal("320.00")).images(List.of(
                    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800"))
                .rating(new BigDecimal("4.7")).reviewCount(167).amenities("Expert Guide,Accommodation,All Meals,Equipment")
                .maxGuests(6).available(true).highlights("3 Days,Rainforest Lodge,Wildlife").category("Adventure").build(),

            Listing.builder().type(Listing.ListingType.HOTEL).title("Santorini Cliff Suites")
                .location("Santorini, Greece").description("Iconic white-washed cliff suites with private plunge pools overlooking the caldera.")
                .price(new BigDecimal("480.00")).images(List.of(
                    "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
                    "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"))
                .rating(new BigDecimal("4.9")).reviewCount(612).amenities("Pool,WiFi,Breakfast,Sunset View")
                .maxGuests(2).available(true).highlights("Caldera View,Plunge Pool,Sunset").category("Luxury").build(),

            Listing.builder().type(Listing.ListingType.TOUR).title("Northern Lights Iceland Tour")
                .location("Reykjavik, Iceland").description("3-night hunt for the Aurora Borealis with expert guides and cozy accommodation.")
                .price(new BigDecimal("410.00")).images(List.of(
                    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800"))
                .rating(new BigDecimal("4.8")).reviewCount(298).amenities("Guide,4WD Vehicle,Accommodation,Meals")
                .maxGuests(8).available(true).highlights("3 Nights,Expert Guide,Aurora Hunt").category("Nature").build(),

            Listing.builder().type(Listing.ListingType.HOTEL).title("Marrakech Riad Medina")
                .location("Marrakech, Morocco").description("Traditional Moroccan riad in the historic medina with rooftop terrace and hammam.")
                .price(new BigDecimal("165.00")).images(List.of(
                    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800"))
                .rating(new BigDecimal("4.7")).reviewCount(189).amenities("WiFi,Hammam,Rooftop,Breakfast,Pool")
                .maxGuests(2).available(true).highlights("Historic Medina,Hammam,Rooftop Terrace").category("Boutique").build()
        );

        listingRepository.saveAll(listings);
        log.info("Seeded {} mock listings", listings.size());
    }
}
