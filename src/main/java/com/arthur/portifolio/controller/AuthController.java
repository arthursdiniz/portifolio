package com.arthur.portifolio.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Endpoint para verificação da chave de acesso do administrador")
@CrossOrigin(origins = "*")
public class AuthController {

    @Value("${portfolio.admin.secret-key:admin123}")
    private String adminSecretKey;

    @PostMapping("/verify")
    @Operation(summary = "Verificar chave administrativa", description = "Valida se a chave informada confere com a chave do administrador.")
    public ResponseEntity<Map<String, Object>> verifyKey(@RequestBody Map<String, String> payload) {
        String key = payload.get("key");
        if (key != null && key.equals(adminSecretKey)) {
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "message", "Autenticação realizada com sucesso!"
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "valid", false,
                "message", "Chave administrativa incorreta."
        ));
    }
}
