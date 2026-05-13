package com.smartcity.traveller.repository;

import com.smartcity.traveller.entity.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    @Query("SELECT l FROM Listing l WHERE " +
           "(:type IS NULL OR l.type = :type) AND " +
           "(:location IS NULL OR LOWER(l.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minPrice IS NULL OR l.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR l.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR l.rating >= :minRating) AND " +
           "(:available IS NULL OR l.available = :available) AND " +
           "(:keyword IS NULL OR LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Listing> searchListings(
            @Param("type") Listing.ListingType type,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") BigDecimal minRating,
            @Param("available") Boolean available,
            @Param("keyword") String keyword,
            Pageable pageable);

    Page<Listing> findByType(Listing.ListingType type, Pageable pageable);

    @Query("SELECT l FROM Listing l ORDER BY l.rating DESC")
    Page<Listing> findTopRated(Pageable pageable);
}
