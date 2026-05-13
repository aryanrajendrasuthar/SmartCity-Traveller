package com.smartcity.traveller.service;

import com.smartcity.traveller.dto.request.BookingRequest;
import com.smartcity.traveller.dto.response.BookingResponse;
import com.smartcity.traveller.entity.Booking;
import com.smartcity.traveller.entity.Listing;
import com.smartcity.traveller.entity.User;
import com.smartcity.traveller.exception.BadRequestException;
import com.smartcity.traveller.exception.ResourceNotFoundException;
import com.smartcity.traveller.repository.BookingRepository;
import com.smartcity.traveller.repository.ListingRepository;
import com.smartcity.traveller.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User user = getCurrentUser();
        Listing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        if (!Boolean.TRUE.equals(listing.getAvailable())) {
            throw new BadRequestException("This listing is not available");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days <= 0) throw new BadRequestException("End date must be after start date");

        BigDecimal totalPrice = listing.getPrice().multiply(BigDecimal.valueOf(days));

        String paymentIntentId = null;
        String clientSecret = null;
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(totalPrice.multiply(BigDecimal.valueOf(100)).longValue())
                    .setCurrency("usd")
                    .setDescription("Booking for " + listing.getTitle())
                    .putMetadata("listingId", listing.getId().toString())
                    .putMetadata("userId", user.getId().toString())
                    .build();
            PaymentIntent intent = PaymentIntent.create(params);
            paymentIntentId = intent.getId();
            clientSecret = intent.getClientSecret();
        } catch (StripeException e) {
            log.error("Stripe error: {}", e.getMessage());
            throw new BadRequestException("Payment initialization failed: " + e.getMessage());
        }

        Booking booking = Booking.builder()
                .user(user)
                .listing(listing)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .guestCount(request.getGuestCount())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.PENDING)
                .stripePaymentIntentId(paymentIntentId)
                .stripeClientSecret(clientSecret)
                .build();

        booking = bookingRepository.save(booking);
        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        Booking booking = findBookingById(bookingId);
        validateBookingOwner(booking);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        emailService.sendBookingConfirmation(booking);
        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String reason) {
        Booking booking = findBookingById(bookingId);
        validateBookingOwner(booking);
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        booking = bookingRepository.save(booking);
        emailService.sendCancellationEmail(booking);
        return BookingResponse.from(booking);
    }

    public Page<BookingResponse> getUserBookings(int page, int size) {
        User user = getCurrentUser();
        return bookingRepository.findByUser(user, PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(BookingResponse::from);
    }

    public BookingResponse getBooking(Long id) {
        Booking booking = findBookingById(id);
        validateBookingOwner(booking);
        return BookingResponse.from(booking);
    }

    // Admin methods
    public Page<BookingResponse> getAllBookings(int page, int size) {
        return bookingRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(BookingResponse::from);
    }

    private Booking findBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private void validateBookingOwner(Booking booking) {
        User currentUser = getCurrentUser();
        if (!booking.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("You don't have permission to access this booking");
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
