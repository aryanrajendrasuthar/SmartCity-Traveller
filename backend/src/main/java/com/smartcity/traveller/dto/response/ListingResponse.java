package com.smartcity.traveller.dto.response;

import com.smartcity.traveller.entity.Listing;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {
    private Long id;
    private Listing.ListingType type;
    private String title;
    private String location;
    private String description;
    private BigDecimal price;
    private List<String> images;
    private BigDecimal rating;
    private Integer reviewCount;
    private String amenities;
    private Integer maxGuests;
    private Boolean available;
    private String highlights;
    private String category;
    private LocalDateTime createdAt;

    public static ListingResponse from(Listing listing) {
        return ListingResponse.builder()
                .id(listing.getId())
                .type(listing.getType())
                .title(listing.getTitle())
                .location(listing.getLocation())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .images(listing.getImages())
                .rating(listing.getRating())
                .reviewCount(listing.getReviewCount())
                .amenities(listing.getAmenities())
                .maxGuests(listing.getMaxGuests())
                .available(listing.getAvailable())
                .highlights(listing.getHighlights())
                .category(listing.getCategory())
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
