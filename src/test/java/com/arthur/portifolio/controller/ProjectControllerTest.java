package com.arthur.portifolio.controller;

import com.arthur.portifolio.dto.ProjectRequestDTO;
import com.arthur.portifolio.dto.ProjectResponseDTO;
import com.arthur.portifolio.exception.GlobalExceptionHandler;
import com.arthur.portifolio.exception.ResourceNotFoundException;
import com.arthur.portifolio.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(projectController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/projects - Deve retornar status 200 e lista de projetos")
    void testGetAllProjects() throws Exception {
        ProjectResponseDTO p = ProjectResponseDTO.builder()
                .id(1L)
                .title("API Spring Boot")
                .shortDescription("Descrição rápida")
                .category("backend")
                .build();

        when(projectService.getAllProjects(null, null)).thenReturn(List.of(p));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("API Spring Boot"));
    }

    @Test
    @DisplayName("GET /api/projects/{id} - Deve retornar 404 quando projeto não existir")
    void testGetProjectByIdNotFound() throws Exception {
        when(projectService.getProjectById(99L))
                .thenThrow(new ResourceNotFoundException("Projeto com ID 99 não encontrado."));

        mockMvc.perform(get("/api/projects/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Projeto com ID 99 não encontrado."));
    }

    @Test
    @DisplayName("POST /api/projects - Deve retornar 201 ao cadastrar projeto válido")
    void testCreateProjectValid() throws Exception {
        ProjectRequestDTO request = ProjectRequestDTO.builder()
                .title("Nova API")
                .shortDescription("Resumo da API")
                .category("backend")
                .build();

        ProjectResponseDTO response = ProjectResponseDTO.builder()
                .id(10L)
                .title("Nova API")
                .shortDescription("Resumo da API")
                .category("backend")
                .build();

        when(projectService.createProject(any(ProjectRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.title").value("Nova API"));
    }

    @Test
    @DisplayName("DELETE /api/projects/{id} - Deve retornar 204 ao excluir projeto")
    void testDeleteProject() throws Exception {
        doNothing().when(projectService).deleteProject(1L);

        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isNoContent());
    }
}
