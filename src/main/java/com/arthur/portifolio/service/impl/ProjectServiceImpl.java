package com.arthur.portifolio.service.impl;

import com.arthur.portifolio.domain.Project;
import com.arthur.portifolio.dto.ProjectRequestDTO;
import com.arthur.portifolio.dto.ProjectResponseDTO;
import com.arthur.portifolio.exception.ResourceNotFoundException;
import com.arthur.portifolio.repository.ProjectRepository;
import com.arthur.portifolio.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects(String category, String search) {
        List<Project> projects = projectRepository.findAll();

        return projects.stream()
                .filter(p -> category == null || category.isBlank() || category.equalsIgnoreCase("all") || p.getCategory().equalsIgnoreCase(category))
                .filter(p -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase();
                    boolean matchTitle = p.getTitle() != null && p.getTitle().toLowerCase().contains(s);
                    boolean matchDesc = (p.getShortDescription() != null && p.getShortDescription().toLowerCase().contains(s)) ||
                                        (p.getLongDescription() != null && p.getLongDescription().toLowerCase().contains(s));
                    boolean matchTags = p.getTags() != null && p.getTags().stream().anyMatch(t -> t.toLowerCase().contains(s));
                    return matchTitle || matchDesc || matchTags;
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto com ID " + id + " não encontrado."));
        return mapToDTO(project);
    }

    @Override
    @Transactional
    public ProjectResponseDTO createProject(ProjectRequestDTO requestDTO) {
        Project project = Project.builder()
                .title(requestDTO.getTitle())
                .shortDescription(requestDTO.getShortDescription())
                .longDescription(requestDTO.getLongDescription())
                .category(requestDTO.getCategory())
                .iconClass(requestDTO.getIconClass() != null && !requestDTO.getIconClass().isBlank() ? requestDTO.getIconClass() : "fa-solid fa-code")
                .tags(requestDTO.getTags() != null ? new ArrayList<>(requestDTO.getTags()) : new ArrayList<>())
                .highlights(requestDTO.getHighlights() != null ? new ArrayList<>(requestDTO.getHighlights()) : new ArrayList<>())
                .architecture(requestDTO.getArchitecture())
                .sourceUrl(requestDTO.getSourceUrl())
                .demoUrl(requestDTO.getDemoUrl())
                .createdAt(LocalDateTime.now())
                .build();

        Project saved = projectRepository.save(project);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public ProjectResponseDTO updateProject(Long id, ProjectRequestDTO requestDTO) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto com ID " + id + " não encontrado para atualização."));

        existing.setTitle(requestDTO.getTitle());
        existing.setShortDescription(requestDTO.getShortDescription());
        existing.setLongDescription(requestDTO.getLongDescription());
        existing.setCategory(requestDTO.getCategory());
        if (requestDTO.getIconClass() != null && !requestDTO.getIconClass().isBlank()) {
            existing.setIconClass(requestDTO.getIconClass());
        }
        if (requestDTO.getTags() != null) {
            existing.setTags(new ArrayList<>(requestDTO.getTags()));
        }
        if (requestDTO.getHighlights() != null) {
            existing.setHighlights(new ArrayList<>(requestDTO.getHighlights()));
        }
        existing.setArchitecture(requestDTO.getArchitecture());
        existing.setSourceUrl(requestDTO.getSourceUrl());
        existing.setDemoUrl(requestDTO.getDemoUrl());

        Project updated = projectRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Projeto com ID " + id + " não encontrado para exclusão.");
        }
        projectRepository.deleteById(id);
    }

    private ProjectResponseDTO mapToDTO(Project project) {
        return ProjectResponseDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .shortDescription(project.getShortDescription())
                .longDescription(project.getLongDescription())
                .category(project.getCategory())
                .iconClass(project.getIconClass())
                .tags(project.getTags() != null ? new ArrayList<>(project.getTags()) : new ArrayList<>())
                .highlights(project.getHighlights() != null ? new ArrayList<>(project.getHighlights()) : new ArrayList<>())
                .architecture(project.getArchitecture())
                .sourceUrl(project.getSourceUrl())
                .demoUrl(project.getDemoUrl())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
