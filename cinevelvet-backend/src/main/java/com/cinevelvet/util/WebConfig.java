package com.cinevelvet.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Sirve la carpeta uploads/portadas como /assets/portadas/
        registry.addResourceHandler("/assets/portadas/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
