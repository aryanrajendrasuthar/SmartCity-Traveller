package com.smartcity.traveller.controller;

import com.smartcity.traveller.dto.response.UserResponse;
import com.smartcity.traveller.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(userService.updateProfile(updates));
    }
}
