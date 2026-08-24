document.addEventListener('DOMContentLoaded', () => {

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-times');
                icon.classList.toggle('fa-bars');
            }
        });

        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });
    }

    const revealOnScroll = () => {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        const windowHeight = window.innerHeight;
        const elementVisible = 80;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);

    const showToast = (message, type = 'success') => {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.className = `toast toast-${type} show`;
        toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
        setTimeout(() => {
            toast.className = 'toast';
        }, 4000);
    };

    let currentCategory = 'all';
    let currentSearch = '';

    const loadProjects = async () => {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        try {
            let url = '/api/projects';
            const params = new URLSearchParams();
            if (currentCategory && currentCategory !== 'all') {
                params.append('category', currentCategory);
            }
            if (currentSearch && currentSearch.trim() !== '') {
                params.append('search', currentSearch.trim());
            }

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const projects = await response.json();
                renderProjects(projects);
            } else {
                projectsGrid.innerHTML = `
                    <div class="empty-state glass-box">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>Não foi possível carregar os projetos no momento.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            projectsGrid.innerHTML = `
                <div class="empty-state glass-box">
                    <i class="fa-solid fa-server"></i>
                    <p>Erro de conexão com a API Spring Boot.</p>
                </div>
            `;
        }
    };

    const renderProjects = (projects) => {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';

        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state glass-box" style="grid-column: 1 / -1;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <h3>Nenhum projeto encontrado</h3>
                    <p>Tente buscar por outro termo ou selecione outra categoria.</p>
                </div>
            `;
            return;
        }

        projects.forEach((proj, index) => {
            let delay = (index % 4) * 0.1;

            let tagsHtml = '';
            if (proj.tags && proj.tags.length > 0) {
                tagsHtml = proj.tags.slice(0, 4).map(t => `<span>${t}</span>`).join('');
                if (proj.tags.length > 4) {
                    tagsHtml += `<span>+${proj.tags.length - 4}</span>`;
                }
            }

            let linksHtml = '';
            if (proj.sourceUrl) {
                linksHtml += `<a href="${proj.sourceUrl}" class="project-link" target="_blank" title="Ver código no GitHub" onclick="event.stopPropagation()"><i class="fa-brands fa-github"></i> Código</a>`;
            }
            if (proj.demoUrl) {
                linksHtml += `<a href="${proj.demoUrl}" class="project-link" target="_blank" title="Ver demonstração" onclick="event.stopPropagation()"><i class="fa-solid fa-play"></i> Demo</a>`;
            }

            const iconClass = proj.iconClass || 'fa-solid fa-code';
            const categoryName = getCategoryLabel(proj.category);

            const cardHTML = `
                <div class="project-card glass-box reveal-up" style="transition-delay: ${delay}s;" data-category="${proj.category}" onclick="window.location.href='project.html?id=${proj.id}'">
                    <div class="project-img placeholder-img">
                        <i class="${iconClass}"></i>
                        <span class="card-category-tag">${categoryName}</span>
                    </div>
                    <div class="project-info">
                        <div class="project-tags">
                            ${tagsHtml}
                        </div>
                        <h3>${proj.title}</h3>
                        <p>${proj.shortDescription || 'Clique para ver os detalhes completos da arquitetura e implementação.'}</p>

                        <div class="project-card-footer">
                            <a href="project.html?id=${proj.id}" class="btn-card-details" onclick="event.stopPropagation()">
                                Ver Detalhes <i class="fa-solid fa-arrow-right"></i>
                            </a>
                            <div class="project-links">
                                ${linksHtml}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            projectsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        setTimeout(revealOnScroll, 100);
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

    const setupFilters = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-filter');
                loadProjects();
            });
        });
    };

    const setupSearch = () => {
        const searchInput = document.getElementById('project-search');
        const clearBtn = document.getElementById('clear-search');
        if (!searchInput) return;

        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            currentSearch = e.target.value;
            if (clearBtn) {
                clearBtn.style.display = currentSearch ? 'block' : 'none';
            }
            debounceTimer = setTimeout(() => {
                loadProjects();
            }, 300);
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                currentSearch = '';
                clearBtn.style.display = 'none';
                loadProjects();
            });
        }
    };

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (response.ok) {
                    showToast(result.message || 'Mensagem enviada com sucesso!', 'success');
                    contactForm.reset();
                } else {
                    let errMsg = result.message || 'Ocorreu um erro ao enviar sua mensagem.';
                    if (result.validationErrors) {
                        errMsg = Object.values(result.validationErrors).join(' ');
                    }
                    showToast(errMsg, 'error');
                }
            } catch (error) {
                console.error('Erro no envio de mensagem:', error);
                showToast('Erro de conexão. Verifique se o backend está em execução.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    setupFilters();
    setupSearch();
    revealOnScroll();
    loadProjects();
});
