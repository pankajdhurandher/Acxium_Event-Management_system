package com.techmart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Returned after a successful login. Frontend stores this in localStorage. */
@Data @NoArgsConstructor @AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String role;   // "ADMIN" | "USER" | "VENDOR"
}
