package com.techmart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security Configuration.
 *
 * Since this is a REST API consumed by plain HTML pages,
 * we disable Spring Security's default login form and CSRF.
 * Authentication is handled manually in controllers via session/role check.
 * CORS is opened so the HTML files can call the API from any origin.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * BCrypt password encoder bean.
     * Used in AuthService to hash and verify passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Main security filter chain.
     * - Disables CSRF (safe for REST APIs with no browser-session cookies)
     * - Enables CORS
     * - Permits all API requests (our controllers do role checking manually)
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())           // disable CSRF for REST
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()           // we handle auth in controllers
            )
            .formLogin(form -> form.disable())      // no default login page
            .httpBasic(basic -> basic.disable());   // no HTTP Basic popup

        return http.build();
    }

    /**
     * Allow all origins so plain HTML files opened from the filesystem
     * (file:// protocol) can call localhost:8080.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
