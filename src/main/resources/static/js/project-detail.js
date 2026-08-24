document.addEventListener('DOMContentLoaded', () => {

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        showErrorState();
        return;
    }

    loadProjectDetails(projectId);
});

async function loadProjectDetails(id) {
    const loader = document.getElementById('project-loader');
    const content = document.getElementById('project-content');
    const errorEl = document.getElementById('project-error');

    try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
            showErrorState();
            return;
        }

        const project = await response.json();
        renderProjectDetails(project);

        if (loader) loader.style.display = 'none';
        if (content) content.style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar detalhes do projeto:', error);
        showErrorState();
    }
}

function renderProjectDetails(p) {
    document.title = `${p.title} | Detalhes do Projeto`;

    const titleEl = document.getElementById('detail-title');
    const categoryEl = document.getElementById('detail-category');
    const shortDescEl = document.getElementById('detail-short-desc');
    const iconEl = document.getElementById('detail-icon');
    const dateEl = document.getElementById('detail-date');

    if (titleEl) titleEl.textContent = p.title;
    if (categoryEl) categoryEl.textContent = getCategoryLabel(p.category);
    if (shortDescEl) shortDescEl.textContent = p.shortDescription || '';
    if (iconEl) iconEl.className = p.iconClass || 'fa-solid fa-code';
    if (dateEl && p.createdAt) {
        const date = new Date(p.createdAt);
        dateEl.innerHTML = `<i class="fa-regular fa-calendar"></i> Cadastrado em ${date.toLocaleDateString('pt-BR')}`;
    }

    const longDescEl = document.getElementById('detail-long-desc');
    if (longDescEl) {
        longDescEl.textContent = p.longDescription || p.shortDescription || 'Sem descrição detalhada cadastrada.';
    }

    const highlightsEl = document.getElementById('detail-highlights');
    if (highlightsEl) {
        highlightsEl.innerHTML = '';
        if (p.highlights && p.highlights.length > 0) {
            p.highlights.forEach(h => {
                highlightsEl.innerHTML += `
                    <li>
                        <i class="fa-solid fa-circle-check highlight-icon"></i>
                        <span>${h}</span>
                    </li>
                `;
            });
        } else {
            highlightsEl.innerHTML = '<li><i class="fa-solid fa-circle-check highlight-icon"></i><span>Desenvolvido seguindo as melhores práticas de código limpo.</span></li>';
        }
    }

    const archEl = document.getElementById('detail-architecture');
    if (archEl) {
        archEl.textContent = p.architecture || 'Arquitetura modular em camadas (Layered Architecture) com separação de Controller, Service, DTOs e Repositories.';
    }

    const tagsEl = document.getElementById('detail-tags');
    if (tagsEl) {
        tagsEl.innerHTML = '';
        if (p.tags && p.tags.length > 0) {
            p.tags.forEach(t => {
                tagsEl.innerHTML += `<span class="detail-tag-item"><i class="fa-solid fa-tag"></i> ${t}</span>`;
            });
        }
    }

    const linksEl = document.getElementById('detail-links');
    const headerActionsEl = document.getElementById('header-action-buttons');
    let linksHtml = '';
    let headerButtonsHtml = '';

    if (p.sourceUrl) {
        linksHtml += `
            <a href="${p.sourceUrl}" target="_blank" class="btn btn-primary w-100 mb-2">
                <i class="fa-brands fa-github"></i> Repositório no GitHub
            </a>
        `;
        headerButtonsHtml += `
            <a href="${p.sourceUrl}" target="_blank" class="btn btn-outline btn-sm">
                <i class="fa-brands fa-github"></i> GitHub
            </a>
        `;
    }

    if (p.demoUrl) {
        linksHtml += `
            <a href="${p.demoUrl}" target="_blank" class="btn btn-secondary w-100 mb-2">
                <i class="fa-solid fa-play"></i> Acessar Demonstração Ao Vivo
            </a>
        `;
        headerButtonsHtml += `
            <a href="${p.demoUrl}" target="_blank" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-play"></i> Live Demo
            </a>
        `;
    }

    if (!p.sourceUrl && !p.demoUrl) {
        linksHtml = `<p class="text-muted">Nenhum link público disponível no momento.</p>`;
    }

    if (linksEl) linksEl.innerHTML = linksHtml;
    if (headerActionsEl) headerActionsEl.innerHTML = headerButtonsHtml;
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
    const errorEl = document.getElementById('project-error');

    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
}
