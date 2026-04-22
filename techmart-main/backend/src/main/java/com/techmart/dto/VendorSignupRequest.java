package com.techmart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class VendorSignupRequest {
    private String businessName;
    private String email;
    private String password;
    private String phone;
}
