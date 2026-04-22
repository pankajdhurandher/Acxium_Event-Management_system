package com.techmart.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// ─── User Signup ───────────────────────────────────────────
@Data @NoArgsConstructor @AllArgsConstructor
public class UserSignupRequest {
    private String name;
    private String email;
    private String password;
}

// ─── Login (all roles use same request) ───────────────────
// placed in LoginRequest.java
