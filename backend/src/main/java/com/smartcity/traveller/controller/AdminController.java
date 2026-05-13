package com.smartcity.traveller.controller;

import com.smartcity.traveller.dto.request.ListingRequest;
import com.smartcity.traveller.dto.response.BookingResponse;
import com.smartcity.traveller.dto.response.ListingResponse;
import com.smartcity.traveller.dto.response.UserResponse;
import com.smartcity.traveller.service.BookingService;
import com.smartcity.traveller.service.ListingService;
import com.smartcity.traveller.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final ListingService listingService;
    private final BookingService bookingService;
    private final UserService userService;

    // Listing management
    @PostMapping("/listings")
    public ResponseEntity<ListingResponse> createListing(@Valid @RequestBody ListingRequest request) {
        return ResponseEntity.ok(listingService.create(request));
    }

    @PutMapping("/listings/{id}")
    public ResponseEntity<ListingResponse> updateListing(@PathVariable Long id,
                                                          @Valid @RequestBody ListingRequest request) {
        return ResponseEntity.ok(listingService.update(id, request));
    }

    @DeleteMapping("/listings/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Booking management
    @GetMapping("/bookings")
    public ResponseEntity<Page<BookingResponse>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(bookingService.getAllBookings(page, size));
    }

    // User management
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.getAllUsers(page, size));
    }
}
