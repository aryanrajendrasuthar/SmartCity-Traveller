package com.smartcity.traveller.dto.response;

import com.smartcity.traveller.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private UserResponse user;
    private ListingResponse listing;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer guestCount;
    private BigDecimal totalPrice;
    private Booking.BookingStatus status;
    private String stripeClientSecret;
    private LocalDateTime createdAt;

    public static BookingResponse from(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .user(UserResponse.from(booking.getUser()))
                .listing(ListingResponse.from(booking.getListing()))
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .guestCount(booking.getGuestCount())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .stripeClientSecret(booking.getStripeClientSecret())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
