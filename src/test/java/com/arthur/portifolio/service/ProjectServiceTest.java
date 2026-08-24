package com.arthur.portifolio.service;

import com.arthur.portifolio.domain.Project;
import com.arthur.portifolio.dto.ProjectRequestDTO;
import com.arthur.portifolio.dto.ProjectResponseDTO;
import com.arthur.portifolio.exception.ResourceNotFoundException;
import com.arthur.portifolio.repository.ProjectRepository;
import com.arthur.portifolio.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project sampleProject;

    @BeforeEach
    void setUp() {
        sampleProject = Project.builder()
                .id(1L)
                .title("E-Commerce API")
                .shortDescription("API RESTful com Spring Boot")
                .longDescription("Descrição detalhada da arquitetura")
                .category("backend")
                .iconClass("fa-solid fa-server")
                .tags(Arrays.asList("Java", "Spring Boot"))
                .highlights(Arrays.asList("JWT Authentication"))
                .architecture("Layered Architecture")
                .sourceUrl("https://github.com/arthur/ecommerce")
                .demoUrl(null)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Deve retornar todos os projetos quando nenhum filtro for passado")
    void testGetAllProjectsWithoutFilter() {
        when(projectRepository.findAll()).thenReturn(List.of(sampleProject));

        List<ProjectResponseDTO> result = projectService.getAllProjects(null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("E-Commerce API", result.get(0).getTitle());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve buscar projeto por ID com sucesso")
    void testGetProjectByIdSuccess() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        ProjectResponseDTO result = projectService.getProjectById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("E-Commerce API", result.getTitle());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando o ID não existir")
    void testGetProjectByIdNotFound() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> projectService.getProjectById(99L));
    }

    @Test
    @DisplayName("Deve criar um novo projeto com sucesso")
    void testCreateProject() {
        ProjectRequestDTO request = ProjectRequestDTO.builder()
                .title("Novo Projeto")
                .shortDescription("Resumo")
                .longDescription("Detalhes")
                .category("backend")
                .tags(List.of("Java"))
                .build();

        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });

        ProjectResponseDTO response = projectService.createProject(request);

        assertNotNull(response);
        assertEquals(2L, response.getId());
        assertEquals("Novo Projeto", response.getTitle());
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Deve deletar projeto existente com sucesso")
    void testDeleteProjectSuccess() {
        when(projectRepository.existsById(1L)).thenReturn(true);
        doNothing().when(projectRepository).deleteById(1L);

        assertDoesNotThrow(() -> projectService.deleteProject(1L));
        verify(projectRepository, times(1)).deleteById(1L);
    }
}
