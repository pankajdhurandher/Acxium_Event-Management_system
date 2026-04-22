package com.techmart.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/** Used by Admin, User, and Vendor login endpoints. */
@Data @NoArgsConstructor @AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
