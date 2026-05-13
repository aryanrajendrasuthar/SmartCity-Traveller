package com.smartcity.traveller.service;

import com.smartcity.traveller.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@smartcitytraveller.com}")
    private String fromEmail;

    @Async
    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Confirmed - Smart City Traveller #" + booking.getId());
            helper.setText(buildConfirmationHtml(booking), true);
            mailSender.send(message);
            log.info("Booking confirmation sent to {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendCancellationEmail(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Cancelled - Smart City Traveller #" + booking.getId());
            helper.setText(buildCancellationHtml(booking), true);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send cancellation email: {}", e.getMessage());
        }
    }

    private String buildConfirmationHtml(Booking booking) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;">
              <div style="background:linear-gradient(135deg,#0EA5E9,#0284C7);padding:32px;border-radius:8px;text-align:center;margin-bottom:24px;">
                <h1 style="color:white;margin:0;font-size:28px;">✈️ Booking Confirmed!</h1>
                <p style="color:#e0f2fe;margin:8px 0 0;">Smart City Traveller</p>
              </div>
              <div style="background:white;padding:24px;border-radius:8px;margin-bottom:16px;">
                <h2 style="color:#0f172a;margin:0 0 16px;">Hi %s,</h2>
                <p style="color:#475569;">Your booking has been confirmed. Here are your details:</p>
                <table style="width:100%%;border-collapse:collapse;">
                  <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Booking ID</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">#%d</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Listing</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">%s</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Location</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">%s</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Dates</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">%s → %s</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Guests</td><td style="padding:8px 0;font-weight:bold;color:#0f172a;">%d</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b;">Total Paid</td><td style="padding:8px 0;font-weight:bold;color:#0EA5E9;font-size:18px;">$%s</td></tr>
                </table>
              </div>
              <p style="color:#94a3b8;font-size:12px;text-align:center;">Thank you for choosing Smart City Traveller!</p>
            </div>
            """.formatted(
                booking.getUser().getName(),
                booking.getId(),
                booking.getListing().getTitle(),
                booking.getListing().getLocation(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getGuestCount(),
                booking.getTotalPrice()
        );
    }

    private String buildCancellationHtml(Booking booking) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;">
              <div style="background:#ef4444;padding:32px;border-radius:8px;text-align:center;margin-bottom:24px;">
                <h1 style="color:white;margin:0;">Booking Cancelled</h1>
              </div>
              <div style="background:white;padding:24px;border-radius:8px;">
                <h2 style="color:#0f172a;">Hi %s,</h2>
                <p>Your booking <strong>#%d</strong> for <strong>%s</strong> has been cancelled.</p>
                <p style="color:#64748b;">If you have any questions, please contact our support team.</p>
              </div>
            </div>
            """.formatted(booking.getUser().getName(), booking.getId(), booking.getListing().getTitle());
    }
}
