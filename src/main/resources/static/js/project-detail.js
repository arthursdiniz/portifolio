document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const projectId = new URLSearchParams(window.location.search).get('id');
    if (!projectId) {
        showErrorState();
        return;
    }

    loadProjectDetails(projectId);
});

async function loadProjectDetails(id) {
    try {
        const response = await fetch(`/api/projects/${encodeURIComponent(id)}`);
        if (!response.ok) {
            showErrorState();
            return;
        }

        renderProjectDetails(await response.json());
        const loader = document.getElementById('project-loader');
        const content = document.getElementById('project-content');
        if (loader) loader.style.display = 'none';
        if (content) content.style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar detalhes do projeto:', error);
        showErrorState();
    }
}

function renderProjectDetails(project) {
    const { escapeHTML, iconNameFromClass, refreshIcons, safeExternalUrl } = window.SiteUI;
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    document.title = `${project.title || 'Projeto'} | Arthur Diniz`;
    setText('detail-title', project.title || 'Projeto sem título');
    setText('detail-category', getCategoryLabel(project.category));
    setText('detail-short-desc', project.shortDescription || '');
    setText('detail-long-desc', project.longDescription || project.shortDescription || 'Sem descrição detalhada cadastrada.');
    setText('detail-architecture', project.architecture || 'Arquitetura modular em camadas, com responsabilidades bem definidas.');

    const iconElement = document.getElementById('detail-icon');
    if (iconElement) iconElement.setAttribute('data-lucide', iconNameFromClass(project.iconClass));

    const dateElement = document.getElementById('detail-date');
    if (dateElement && project.createdAt) {
        const date = new Date(project.createdAt);
        if (!Number.isNaN(date.getTime())) {
            dateElement.innerHTML = `<i data-lucide="calendar-days"></i> Cadastrado em ${escapeHTML(date.toLocaleDateString('pt-BR'))}`;
        }
    }

    const highlightsElement = document.getElementById('detail-highlights');
    if (highlightsElement) {
        const highlights = Array.isArray(project.highlights) && project.highlights.length
            ? project.highlights
            : ['Desenvolvido seguindo boas práticas de organização e legibilidade de código.'];

        highlightsElement.innerHTML = '';
        highlights.forEach((highlight) => {
            const item = document.createElement('li');
            const icon = document.createElement('i');
            const text = document.createElement('span');
            icon.setAttribute('data-lucide', 'circle-check');
            text.textContent = highlight;
            item.append(icon, text);
            highlightsElement.appendChild(item);
        });
    }

    const tagsElement = document.getElementById('detail-tags');
    if (tagsElement) {
        tagsElement.innerHTML = '';
        (Array.isArray(project.tags) ? project.tags : []).forEach((tag) => {
            const item = document.createElement('span');
            item.className = 'detail-tag-item';
            item.textContent = tag;
            tagsElement.appendChild(item);
        });
    }

    const sourceUrl = safeExternalUrl(project.sourceUrl);
    const demoUrl = safeExternalUrl(project.demoUrl);
    const linksElement = document.getElementById('detail-links');
    const headerActionsElement = document.getElementById('header-action-buttons');

    const sidebarLinks = [];
    const headerLinks = [];
    if (sourceUrl) {
        sidebarLinks.push(`<a href="${escapeHTML(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary w-100"><i data-lucide="github"></i> Repositório no GitHub</a>`);
        headerLinks.push(`<a href="${escapeHTML(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i data-lucide="github"></i> GitHub</a>`);
    }
    if (demoUrl) {
        sidebarLinks.push(`<a href="${escapeHTML(demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary w-100"><i data-lucide="play"></i> Abrir demonstração</a>`);
        headerLinks.push(`<a href="${escapeHTML(demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i data-lucide="play"></i> Demo</a>`);
    }

    if (linksElement) {
        linksElement.innerHTML = sidebarLinks.length
            ? sidebarLinks.join('')
            : '<p class="text-muted">Nenhum link público disponível no momento.</p>';
    }
    if (headerActionsElement) headerActionsElement.innerHTML = headerLinks.join('');

    refreshIcons(document);
}

function getCategoryLabel(category) {
    switch (category?.toLowerCase()) {
        case 'backend': return 'Backend Java';
        case 'game': return 'Jogo';
        case 'academic': return 'Acadêmico';
        case 'fullstack': return 'Fullstack';
        default: return 'Geral';
    }
}

function showErrorState() {
    const loader = document.getElementById('project-loader');
    const content = document.getElementById('project-content');
    const error = document.getElementById('project-error');

    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'none';
    if (error) error.style.display = 'block';
    if (window.SiteUI) window.SiteUI.refreshIcons(error || document);
}
