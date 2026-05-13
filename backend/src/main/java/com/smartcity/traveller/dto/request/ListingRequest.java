package com.smartcity.traveller.dto.request;

import com.smartcity.traveller.entity.Listing;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ListingRequest {
    @NotNull
    private Listing.ListingType type;

    @NotBlank
    private String title;

    @NotBlank
    private String location;

    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    private List<String> images;

    private String amenities;

    private Integer maxGuests;

    private Boolean available;

    private String highlights;

    private String category;
}
