document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const { escapeHTML, iconNameFromClass, refreshIcons, showToast } = window.SiteUI;
    const authOverlay = document.getElementById('auth-overlay');
    const authForm = document.getElementById('auth-form');
    const authKeyInput = document.getElementById('auth-key-input');
    const authError = document.getElementById('auth-error');
    const toggleKeyButton = document.getElementById('toggle-key-visibility');
    const dashboard = document.getElementById('admin-dashboard-content');
    const logoutButton = document.getElementById('btn-logout');
    const navLogoutItem = document.getElementById('nav-logout-item');
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const projectForm = document.getElementById('project-form');
    let adminKey = sessionStorage.getItem('portfolio_admin_key') || '';
    let projectsList = [];
    let lastFocusedElement = null;

    const setButtonLoading = (button, isLoading, label) => {
        if (!button) return;
        if (isLoading) {
            button.dataset.originalHtml = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<i data-lucide="loader-circle" class="loading-icon"></i><span>${escapeHTML(label)}</span>`;
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalHtml || button.innerHTML;
        }
        refreshIcons(button);
    };

    const showLockScreen = (message = '') => {
        if (authOverlay) authOverlay.style.display = 'grid';
        if (dashboard) dashboard.style.display = 'none';
        if (navLogoutItem) navLogoutItem.style.display = 'none';
        if (authError) {
            authError.textContent = message;
            authError.style.display = message ? 'block' : 'none';
        }
        window.setTimeout(() => authKeyInput?.focus(), 30);
    };

    const unlockDashboard = () => {
        if (authOverlay) authOverlay.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        if (navLogoutItem) navLogoutItem.style.display = 'block';
        refreshIcons(document);
        loadAdminProjects();
        loadContactMessages();
    };

    const verifyAuth = async (keyToTest) => {
        if (!keyToTest) {
            showLockScreen();
            return false;
        }

        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: keyToTest })
            });

            if (!response.ok) {
                sessionStorage.removeItem('portfolio_admin_key');
                adminKey = '';
                showLockScreen('Chave administrativa incorreta. Tente novamente.');
                return false;
            }

            adminKey = keyToTest;
            sessionStorage.setItem('portfolio_admin_key', adminKey);
            unlockDashboard();
            return true;
        } catch (error) {
            console.error('Erro na autenticação:', error);
            showLockScreen('Não foi possível comunicar com o servidor.');
            return false;
        }
    };

    if (toggleKeyButton && authKeyInput) {
        toggleKeyButton.addEventListener('click', () => {
            const shouldShow = authKeyInput.type === 'password';
            authKeyInput.type = shouldShow ? 'text' : 'password';
            toggleKeyButton.setAttribute('aria-label', shouldShow ? 'Ocultar chave' : 'Mostrar chave');
            toggleKeyButton.innerHTML = `<i data-lucide="${shouldShow ? 'eye-off' : 'eye'}"></i>`;
            refreshIcons(toggleKeyButton);
        });
    }

    authForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = document.getElementById('btn-verify-auth');
        setButtonLoading(button, true, 'Verificando...');
        await verifyAuth(authKeyInput.value.trim());
        setButtonLoading(button, false);
    });

    logoutButton?.addEventListener('click', () => {
        sessionStorage.removeItem('portfolio_admin_key');
        adminKey = '';
        showLockScreen('Sessão encerrada. Digite a chave para acessar novamente.');
    });

    document.querySelectorAll('.admin-tab-btn').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn').forEach((item) => {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.admin-tab-content').forEach((panel) => {
                panel.classList.remove('active');
                panel.hidden = true;
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            const target = document.getElementById(button.dataset.tab);
            if (target) {
                target.hidden = false;
                target.classList.add('active');
            }
            if (button.dataset.tab === 'tab-messages') loadContactMessages();
        });
    });

    const loadAdminProjects = async () => {
        const tableBody = document.getElementById('admin-projects-table-body');

        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error(`Resposta inesperada: ${response.status}`);
            projectsList = await response.json();
            document.getElementById('project-count').textContent = projectsList.length;
            renderAdminProjects(projectsList);
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">Não foi possível carregar os projetos.</td></tr>';
        }
    };

    const renderAdminProjects = (projects) => {
        const tableBody = document.getElementById('admin-projects-table-body');
        if (!tableBody) return;

        if (!projects.length) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Nenhum projeto cadastrado.</td></tr>';
            return;
        }

        tableBody.innerHTML = projects.map((project) => {
            const tags = Array.isArray(project.tags)
                ? project.tags.slice(0, 4).map((tag) => `<span class="badge-mini">${escapeHTML(tag)}</span>`).join(' ')
                : '';

            return `
                <tr>
                    <td><strong>#${escapeHTML(project.id)}</strong></td>
                    <td><i data-lucide="${iconNameFromClass(project.iconClass)}"></i></td>
                    <td><strong>${escapeHTML(project.title || '')}</strong><div class="text-muted small">${escapeHTML(project.shortDescription || '')}</div></td>
                    <td><span class="project-category-badge">${escapeHTML(project.category || 'geral')}</span></td>
                    <td>${tags}</td>
                    <td>
                        <div class="table-actions">
                            <a href="project.html?id=${encodeURIComponent(project.id)}" target="_blank" rel="noopener noreferrer" class="btn-action" aria-label="Visualizar ${escapeHTML(project.title || 'projeto')}"><i data-lucide="eye"></i></a>
                            <button type="button" class="btn-action edit-project" data-project-id="${escapeHTML(project.id)}" aria-label="Editar ${escapeHTML(project.title || 'projeto')}"><i data-lucide="pencil"></i></button>
                            <button type="button" class="btn-action delete delete-project" data-project-id="${escapeHTML(project.id)}" aria-label="Excluir ${escapeHTML(project.title || 'projeto')}"><i data-lucide="trash-2"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        refreshIcons(tableBody);
    };

    const openModal = (project = null) => {
        if (!modal || !projectForm) return;
        lastFocusedElement = document.activeElement;
        projectForm.reset();
        document.getElementById('form-project-id').value = '';

        if (project) {
            modalTitle.textContent = `Editar projeto #${project.id}`;
            document.getElementById('form-project-id').value = project.id;
            document.getElementById('form-title').value = project.title || '';
            document.getElementById('form-category').value = project.category || 'backend';
            document.getElementById('form-icon').value = project.iconClass || 'fa-solid fa-server';
            document.getElementById('form-short-desc').value = project.shortDescription || '';
            document.getElementById('form-long-desc').value = project.longDescription || '';
            document.getElementById('form-architecture').value = project.architecture || '';
            document.getElementById('form-tags').value = Array.isArray(project.tags) ? project.tags.join(', ') : '';
            document.getElementById('form-highlights').value = Array.isArray(project.highlights) ? project.highlights.join('\n') : '';
            document.getElementById('form-source-url').value = project.sourceUrl || '';
            document.getElementById('form-demo-url').value = project.demoUrl || '';
        } else {
            modalTitle.textContent = 'Adicionar novo projeto';
        }

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        window.setTimeout(() => document.getElementById('form-title')?.focus(), 30);
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        lastFocusedElement?.focus();
    };

    document.getElementById('btn-open-new-project-modal')?.addEventListener('click', () => openModal());
    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel-btn')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal?.classList.contains('show')) closeModal();
    });

    document.getElementById('admin-projects-table-body')?.addEventListener('click', (event) => {
        const editButton = event.target.closest('.edit-project');
        const deleteButton = event.target.closest('.delete-project');
        if (editButton) {
            const project = projectsList.find((item) => String(item.id) === editButton.dataset.projectId);
            if (project) openModal(project);
        }
        if (deleteButton) deleteProject(deleteButton.dataset.projectId);
    });

    projectForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = document.getElementById('form-submit-btn');
        const id = document.getElementById('form-project-id').value;
        const isEdit = Boolean(id);
        setButtonLoading(submitButton, true, 'Salvando...');

        const splitValues = (value, separator) => value.split(separator).map((item) => item.trim()).filter(Boolean);
        const payload = {
            title: document.getElementById('form-title').value.trim(),
            category: document.getElementById('form-category').value,
            iconClass: document.getElementById('form-icon').value,
            shortDescription: document.getElementById('form-short-desc').value.trim(),
            longDescription: document.getElementById('form-long-desc').value.trim(),
            architecture: document.getElementById('form-architecture').value.trim(),
            tags: splitValues(document.getElementById('form-tags').value, ','),
            highlights: splitValues(document.getElementById('form-highlights').value, '\n'),
            sourceUrl: document.getElementById('form-source-url').value.trim() || null,
            demoUrl: document.getElementById('form-demo-url').value.trim() || null
        };

        try {
            const response = await fetch(isEdit ? `/api/projects/${encodeURIComponent(id)}` : '/api/projects', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showToast(`Projeto ${isEdit ? 'atualizado' : 'criado'} com sucesso.`);
                closeModal();
                loadAdminProjects();
            } else if (response.status === 401) {
                showToast('Sessão expirada. Entre novamente.', 'error');
                showLockScreen('Autenticação necessária.');
            } else {
                const error = await response.json().catch(() => ({}));
                const validation = error.validationErrors ? Object.values(error.validationErrors).join(' ') : '';
                showToast(validation || error.message || 'Não foi possível salvar o projeto.', 'error');
            }
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            showToast('Erro de conexão com o servidor.', 'error');
        } finally {
            setButtonLoading(submitButton, false);
        }
    });

    const deleteProject = async (id) => {
        if (!window.confirm(`Tem certeza que deseja excluir o projeto #${id}?`)) return;

        try {
            const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: { 'X-Admin-Key': adminKey }
            });

            if (response.ok || response.status === 204) {
                showToast('Projeto removido com sucesso.');
                loadAdminProjects();
            } else if (response.status === 401) {
                showToast('Acesso não autorizado.', 'error');
                showLockScreen('Autenticação necessária.');
            } else {
                showToast('Não foi possível remover o projeto.', 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            showToast('Erro de conexão ao excluir.', 'error');
        }
    };

    const loadContactMessages = async () => {
        const tableBody = document.getElementById('admin-messages-table-body');
        try {
            const response = await fetch('/api/contact', { headers: { 'X-Admin-Key': adminKey } });
            if (response.status === 401) {
                showLockScreen('Autenticação necessária para visualizar os registros.');
                return;
            }
            if (!response.ok) throw new Error(`Resposta inesperada: ${response.status}`);

            const messages = await response.json();
            document.getElementById('message-count').textContent = messages.length;
            renderContactMessages(messages);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
            if (tableBody) tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Não foi possível carregar as mensagens.</td></tr>';
        }
    };

    const renderContactMessages = (messages) => {
        const tableBody = document.getElementById('admin-messages-table-body');
        if (!tableBody) return;
        if (!messages.length) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Nenhuma mensagem registrada.</td></tr>';
            return;
        }

        tableBody.innerHTML = messages.map((message) => {
            const date = message.createdAt ? new Date(message.createdAt).toLocaleString('pt-BR') : '—';
            return `<tr><td><strong>#${escapeHTML(message.id)}</strong></td><td>${escapeHTML(date)}</td><td><strong>${escapeHTML(message.name || '')}</strong></td><td>${escapeHTML(message.email || '')}</td><td>${escapeHTML(message.message || '')}</td></tr>`;
        }).join('');
    };

    if (adminKey) verifyAuth(adminKey);
    else showLockScreen();
});
