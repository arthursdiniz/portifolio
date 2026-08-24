package com.arthur.portifolio.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Arthur | Portfolio Backend API")
                        .version("1.0.0")
                        .description("API RESTful desenvolvida em Java com Spring Boot, Spring Data JPA, H2 Database e Bean Validation para o portfólio profissional de Arthur.")
                        .contact(new Contact()
                                .name("Arthur")
                                .url("https://github.com/arthur")
                                .email("arthur@exemplo.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
