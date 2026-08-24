package com.arthur.portifolio.controller;

import com.arthur.portifolio.dto.ContactMessageRequestDTO;
import com.arthur.portifolio.dto.ContactMessageResponseDTO;
import com.arthur.portifolio.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contato", description = "Endpoints para envio e consulta de mensagens de contato")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @Operation(summary = "Enviar mensagem de contato", description = "Recebe e persiste uma mensagem enviada através do formulário de contato.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Mensagem recebida com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados da mensagem inválidos")
    })
    public ResponseEntity<Map<String, Object>> receiveMessage(@Valid @RequestBody ContactMessageRequestDTO requestDTO) {
        ContactMessageResponseDTO saved = contactService.saveMessage(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Mensagem recebida com sucesso! Em breve entrarei em contato.",
                "data", saved
        ));
    }

    @GetMapping
    @Operation(summary = "Listar mensagens de contato", description = "Retorna todas as mensagens de contato recebidas (para o painel de administração).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de mensagens retornada com sucesso")
    })
    public ResponseEntity<List<ContactMessageResponseDTO>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }
}

