package com.techmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the TechMart Spring Boot application.
 * Run this class to start the server on port 8080.
 */
@SpringBootApplication
public class TechMartApplication {

    public static void main(String[] args) {
        SpringApplication.run(TechMartApplication.class, args);
    }
}
