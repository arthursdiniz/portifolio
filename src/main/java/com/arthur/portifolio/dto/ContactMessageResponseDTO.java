package com.arthur.portifolio.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO de resposta para mensagens de contato recebidas")
public class ContactMessageResponseDTO {

    @Schema(description = "ID único da mensagem", example = "1")
    private Long id;

    @Schema(description = "Nome do remetente", example = "Arthur")
    private String name;

    @Schema(description = "E-mail do remetente", example = "recrutador@empresa.com")
    private String email;

    @Schema(description = "Conteúdo da mensagem")
    private String message;

    @Schema(description = "Data e hora de envio")
    private LocalDateTime createdAt;
}
