package com.skillexchange;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "https://skill-exchange-git-main-itspavannk.vercel.app",
                        "capacitor://localhost",
                        "http://localhost")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}