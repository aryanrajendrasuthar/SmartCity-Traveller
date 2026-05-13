package com.smartcity.traveller.service;

import com.smartcity.traveller.dto.request.ListingRequest;
import com.smartcity.traveller.dto.response.ListingResponse;
import com.smartcity.traveller.entity.Listing;
import com.smartcity.traveller.exception.ResourceNotFoundException;
import com.smartcity.traveller.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;

    public Page<ListingResponse> searchListings(
            String type, String location,
            BigDecimal minPrice, BigDecimal maxPrice,
            BigDecimal minRating, Boolean available,
            String keyword, String sortBy,
            int page, int size) {

        Listing.ListingType listingType = null;
        if (type != null && !type.isBlank()) {
            try {
                listingType = Listing.ListingType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Sort sort = switch (sortBy != null ? sortBy : "") {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating"     -> Sort.by("rating").descending();
            default           -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        return listingRepository.searchListings(
                listingType, location, minPrice, maxPrice, minRating, available, keyword, pageable
        ).map(ListingResponse::from);
    }

    @Cacheable(value = "listing", key = "#id")
    public ListingResponse getById(Long id) {
        return ListingResponse.from(findById(id));
    }

    public Page<ListingResponse> getFeatured(int page, int size) {
        return listingRepository.findTopRated(PageRequest.of(page, size))
                .map(ListingResponse::from);
    }

    @CacheEvict(value = "listing", allEntries = true)
    public ListingResponse create(ListingRequest request) {
        Listing listing = Listing.builder()
                .type(request.getType())
                .title(request.getTitle())
                .location(request.getLocation())
                .description(request.getDescription())
                .price(request.getPrice())
                .images(request.getImages())
                .amenities(request.getAmenities())
                .maxGuests(request.getMaxGuests())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .highlights(request.getHighlights())
                .category(request.getCategory())
                .rating(BigDecimal.ZERO)
                .reviewCount(0)
                .build();
        return ListingResponse.from(listingRepository.save(listing));
    }

    @CacheEvict(value = "listing", key = "#id")
    public ListingResponse update(Long id, ListingRequest request) {
        Listing listing = findById(id);
        listing.setType(request.getType());
        listing.setTitle(request.getTitle());
        listing.setLocation(request.getLocation());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        if (request.getImages() != null) listing.setImages(request.getImages());
        listing.setAmenities(request.getAmenities());
        listing.setMaxGuests(request.getMaxGuests());
        if (request.getAvailable() != null) listing.setAvailable(request.getAvailable());
        listing.setHighlights(request.getHighlights());
        listing.setCategory(request.getCategory());
        return ListingResponse.from(listingRepository.save(listing));
    }

    @CacheEvict(value = "listing", key = "#id")
    public void delete(Long id) {
        listingRepository.delete(findById(id));
    }

    private Listing findById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));
    }
}
