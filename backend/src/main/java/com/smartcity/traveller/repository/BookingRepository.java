package com.smartcity.traveller.repository;

import com.smartcity.traveller.entity.Booking;
import com.smartcity.traveller.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByUser(User user, Pageable pageable);
    List<Booking> findByUser(User user);
    Optional<Booking> findByStripePaymentIntentId(String paymentIntentId);
    long countByStatus(Booking.BookingStatus status);
}
