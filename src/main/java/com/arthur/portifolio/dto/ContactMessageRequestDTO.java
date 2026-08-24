package com.arthur.portifolio.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para envio de mensagem de contato")
public class ContactMessageRequestDTO {

    @NotBlank(message = "O nome é obrigatório.")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres.")
    @Schema(description = "Nome do remetente", example = "Arthur")
    private String name;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um endereço de e-mail válido.")
    @Schema(description = "E-mail de contato", example = "recrutador@empresa.com")
    private String email;

    @NotBlank(message = "A mensagem é obrigatória.")
    @Size(min = 10, max = 2000, message = "A mensagem deve conter entre 10 e 2000 caracteres.")
    @Schema(description = "Conteúdo da mensagem", example = "Olá Arthur, gostei muito do seu portfólio e gostaria de conversar sobre uma vaga de estágio Java.")
    private String message;
}
