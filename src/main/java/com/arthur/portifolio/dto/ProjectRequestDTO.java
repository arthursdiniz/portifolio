package com.arthur.portifolio.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para criação e atualização de projetos")
public class ProjectRequestDTO {

    @NotBlank(message = "O título do projeto é obrigatório.")
    @Size(min = 2, max = 150, message = "O título deve conter entre 2 e 150 caracteres.")
    @Schema(description = "Título do projeto", example = "E-Commerce REST API")
    private String title;

    @NotBlank(message = "A descrição curta é obrigatória.")
    @Size(max = 1000, message = "A descrição curta deve conter no máximo 1000 caracteres.")
    @Schema(description = "Resumo curto exibido nos cards da home", example = "API RESTful com autenticação JWT e Spring Security.")
    private String shortDescription;

    @Size(max = 4000, message = "A descrição detalhada deve conter no máximo 4000 caracteres.")
    @Schema(description = "Descrição detalhada do projeto para a página de detalhes", example = "Arquitetura com autenticação stateless via tokens JWT, controle de permissões por roles (ADMIN/USER), documentação com Swagger e testes unitários com JUnit 5.")
    private String longDescription;

    @NotBlank(message = "A categoria é obrigatória (ex: backend, game, academic, fullstack).")
    @Schema(description = "Categoria do projeto", example = "backend")
    private String category;

    @Schema(description = "Classe do ícone FontAwesome", example = "fa-solid fa-server")
    private String iconClass;

    @Schema(description = "Lista de tags/tecnologias")
    private List<String> tags;

    @Schema(description = "Lista de destaques e funcionalidades chave")
    private List<String> highlights;

    @Schema(description = "Padrão de arquitetura utilizado", example = "Clean Architecture / Layered Architecture com DTOs e Services")
    private String architecture;

    @Schema(description = "Link do repositório no GitHub", example = "https://github.com/arthur/ecommerce-api")
    private String sourceUrl;

    @Schema(description = "Link para demonstração ao vivo ou documentação", example = "https://ecommerce-api.demo.com")
    private String demoUrl;
}
