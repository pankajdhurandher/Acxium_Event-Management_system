package com.techmart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig tells Spring Boot:
 *  1. Serve all files in /static/ as plain HTTP files.
 *  2. When someone visits http://localhost:8080/  → redirect to login.html
 *
 * After this, your full frontend is available at:
 *   http://localhost:8080/login.html
 *   http://localhost:8080/products.html
 *   ... etc.
 *
 * No need to open HTML files from the filesystem manually.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Redirect the root URL "/" to login page.
     * So visiting http://localhost:8080 opens login automatically.
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/", "/login.html");
    }

    /**
     * Serve static resources (HTML, CSS, JS) from the classpath /static/ folder.
     * Spring Boot already does this by default, but being explicit is cleaner.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
