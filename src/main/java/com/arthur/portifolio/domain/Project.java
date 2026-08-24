package com.arthur.portifolio.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String shortDescription;

    @Column(length = 4000)
    private String longDescription;

    @Column(nullable = false)
    private String category;

    private String iconClass;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_highlights", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "highlight", length = 1000)
    @Builder.Default
    private List<String> highlights = new ArrayList<>();

    @Column(length = 1000)
    private String architecture;

    private String sourceUrl;
    private String demoUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

