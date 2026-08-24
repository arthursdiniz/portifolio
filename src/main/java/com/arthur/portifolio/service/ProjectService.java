package com.arthur.portifolio.service;

import com.arthur.portifolio.dto.ProjectRequestDTO;
import com.arthur.portifolio.dto.ProjectResponseDTO;

import java.util.List;

public interface ProjectService {
    List<ProjectResponseDTO> getAllProjects(String category, String search);
    ProjectResponseDTO getProjectById(Long id);
    ProjectResponseDTO createProject(ProjectRequestDTO requestDTO);
    ProjectResponseDTO updateProject(Long id, ProjectRequestDTO requestDTO);
    void deleteProject(Long id);
}
