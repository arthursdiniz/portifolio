package com.arthur.portifolio.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO de resposta contendo informações de um projeto")
public class ProjectResponseDTO {

    @Schema(description = "ID único do projeto", example = "1")
    private Long id;

    @Schema(description = "Título do projeto", example = "E-Commerce REST API")
    private String title;

    @Schema(description = "Resumo curto exibido nos cards da home")
    private String shortDescription;

    @Schema(description = "Descrição detalhada do projeto")
    private String longDescription;

    @Schema(description = "Categoria do projeto (backend, game, academic, fullstack)")
    private String category;

    @Schema(description = "Classe do ícone FontAwesome")
    private String iconClass;

    @Schema(description = "Lista de tags/tecnologias utilizadas")
    private List<String> tags;

    @Schema(description = "Lista de destaques e diferenciais técnicos")
    private List<String> highlights;

    @Schema(description = "Padrão de arquitetura")
    private String architecture;

    @Schema(description = "Link do código fonte no GitHub")
    private String sourceUrl;

    @Schema(description = "Link da demo ou Swagger ao vivo")
    private String demoUrl;

    @Schema(description = "Data de cadastro do projeto")
    private LocalDateTime createdAt;
}
