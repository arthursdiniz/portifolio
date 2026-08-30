document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const { escapeHTML, iconNameFromClass, refreshIcons, safeExternalUrl } = window.SiteUI;
    let currentCategory = 'all';
    let currentSearch = '';

    const revealImmediately = (elements) => {
        elements.forEach((element) => element.classList.add('active'));
    };

    const setupReveals = (root = document) => {
        const elements = [...root.querySelectorAll('.reveal-up:not(.active), .reveal-left:not(.active), .reveal-right:not(.active)')];
        if (!elements.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            revealImmediately(elements);
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                currentObserver.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        elements.forEach((element) => observer.observe(element));
    };

    const getCategoryLabel = (category) => {
        switch (category?.toLowerCase()) {
            case 'backend': return 'Backend Java';
            case 'game': return 'Jogo';
            case 'academic': return 'Acadêmico';
            case 'fullstack': return 'Fullstack';
            default: return 'Geral';
        }
    };

    const renderEmptyState = (icon, title, message) => {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = `
            <div class="empty-state">
                <i data-lucide="${icon}"></i>
                <h3>${escapeHTML(title)}</h3>
                <p>${escapeHTML(message)}</p>
            </div>
        `;
        projectsGrid.setAttribute('aria-busy', 'false');
        refreshIcons(projectsGrid);
    };

    const renderProjects = (projects) => {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';
        projectsGrid.setAttribute('aria-busy', 'false');

        if (!Array.isArray(projects) || projects.length === 0) {
            renderEmptyState('search-x', 'Nenhum projeto encontrado', 'Tente outro termo ou selecione uma categoria diferente.');
            return;
        }

        projects.forEach((project) => {
            const tags = Array.isArray(project.tags) ? project.tags : [];
            const tagsHTML = tags.slice(0, 4).map((tag) => `<span>${escapeHTML(tag)}</span>`).join('');
            const overflowTag = tags.length > 4 ? `<span>+${tags.length - 4}</span>` : '';
            const sourceUrl = safeExternalUrl(project.sourceUrl);
            const demoUrl = safeExternalUrl(project.demoUrl);
            const projectUrl = `project.html?id=${encodeURIComponent(project.id)}`;
            const icon = iconNameFromClass(project.iconClass);

            const externalLinks = [
                sourceUrl ? `<a href="${escapeHTML(sourceUrl)}" class="project-link" target="_blank" rel="noopener noreferrer"><i data-lucide="github"></i> Código</a>` : '',
                demoUrl ? `<a href="${escapeHTML(demoUrl)}" class="project-link" target="_blank" rel="noopener noreferrer"><i data-lucide="play"></i> Demo</a>` : ''
            ].join('');

            const article = document.createElement('article');
            article.className = 'project-card reveal-up';
            article.innerHTML = `
                <div class="project-card-topline">
                    <div class="project-icon-box" aria-hidden="true"><i data-lucide="${icon}"></i></div>
                    <span class="card-category-tag">${escapeHTML(getCategoryLabel(project.category))}</span>
                </div>
                <div class="project-info">
                    <div class="project-tags">${tagsHTML}${overflowTag}</div>
                    <h3><a href="${projectUrl}">${escapeHTML(project.title || 'Projeto sem título')}</a></h3>
                    <p>${escapeHTML(project.shortDescription || 'Veja os detalhes da arquitetura e da implementação deste projeto.')}</p>
                    <div class="project-card-footer">
                        <a href="${projectUrl}" class="btn-card-details">Ver estudo de caso <i data-lucide="arrow-right"></i></a>
                        <div class="project-links">${externalLinks}</div>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(article);
        });

        refreshIcons(projectsGrid);
        setupReveals(projectsGrid);
    };

    const loadProjects = async () => {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.setAttribute('aria-busy', 'true');

        try {
            const params = new URLSearchParams();
            if (currentCategory !== 'all') params.set('category', currentCategory);
            if (currentSearch.trim()) params.set('search', currentSearch.trim());

            const query = params.toString();
            const response = await fetch(`/api/projects${query ? `?${query}` : ''}`);
            if (!response.ok) throw new Error(`Resposta inesperada: ${response.status}`);

            renderProjects(await response.json());
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            renderEmptyState('server-off', 'Projetos indisponíveis', 'Não foi possível conectar à API neste momento.');
        }
    };

    const setupFilters = () => {
        document.querySelectorAll('.filter-btn').forEach((button) => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach((item) => {
                    item.classList.remove('active');
                    item.setAttribute('aria-pressed', 'false');
                });

                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                currentCategory = button.dataset.filter || 'all';
                loadProjects();
            });
        });
    };

    const setupSearch = () => {
        const searchInput = document.getElementById('project-search');
        const clearButton = document.getElementById('clear-search');
        if (!searchInput) return;

        let debounceTimer;
        searchInput.addEventListener('input', (event) => {
            window.clearTimeout(debounceTimer);
            currentSearch = event.target.value;
            if (clearButton) clearButton.style.display = currentSearch ? 'grid' : 'none';
            debounceTimer = window.setTimeout(loadProjects, 300);
        });

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                currentSearch = '';
                clearButton.style.display = 'none';
                searchInput.focus();
                loadProjects();
            });
        }
    };

    setupFilters();
    setupSearch();
    setupReveals();
    loadProjects();
});
