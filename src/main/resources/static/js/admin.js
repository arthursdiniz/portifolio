document.addEventListener('DOMContentLoaded', () => {

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const authOverlay = document.getElementById('auth-overlay');
    const authForm = document.getElementById('auth-form');
    const authKeyInput = document.getElementById('auth-key-input');
    const authError = document.getElementById('auth-error');
    const toggleKeyBtn = document.getElementById('toggle-key-visibility');
    const dashboardContent = document.getElementById('admin-dashboard-content');
    const logoutBtn = document.getElementById('btn-logout');
    const navLogoutItem = document.getElementById('nav-logout-item');

    let adminKey = sessionStorage.getItem('portfolio_admin_key') || '';

    if (toggleKeyBtn && authKeyInput) {
        toggleKeyBtn.addEventListener('click', () => {
            const isPassword = authKeyInput.type === 'password';
            authKeyInput.type = isPassword ? 'text' : 'password';
            toggleKeyBtn.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
        });
    }

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

            if (response.ok) {
                adminKey = keyToTest;
                sessionStorage.setItem('portfolio_admin_key', adminKey);
                unlockDashboard();
                return true;
            } else {
                showLockScreen('Chave administrativa incorreta. Tente novamente.');
                sessionStorage.removeItem('portfolio_admin_key');
                adminKey = '';
                return false;
            }
        } catch (error) {
            console.error('Erro na autenticação:', error);
            showLockScreen('Erro de comunicação com o servidor Spring Boot.');
            return false;
        }
    };

    const showLockScreen = (errorMessage = '') => {
        if (authOverlay) authOverlay.style.display = 'flex';
        if (dashboardContent) dashboardContent.style.display = 'none';
        if (navLogoutItem) navLogoutItem.style.display = 'none';
        if (authError) {
            if (errorMessage) {
                authError.textContent = errorMessage;
                authError.style.display = 'block';
            } else {
                authError.style.display = 'none';
            }
        }
        if (authKeyInput) authKeyInput.focus();
    };

    const unlockDashboard = () => {
        if (authOverlay) authOverlay.style.display = 'none';
        if (dashboardContent) dashboardContent.style.display = 'block';
        if (navLogoutItem) navLogoutItem.style.display = 'block';
        loadAdminProjects();
        loadContactMessages();
    };

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-verify-auth');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Verificando...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const enteredKey = authKeyInput.value.trim();
            await verifyAuth(enteredKey);

            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('portfolio_admin_key');
            adminKey = '';
            showLockScreen('Sessão encerrada. Digite a chave para acessar novamente.');
        });
    }

    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');

            if (target === 'tab-messages') {
                loadContactMessages();
            }
        });
    });

    const showToast = (message, type = 'success') => {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.className = `toast toast-${type} show`;
        toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
        setTimeout(() => {
            toast.className = 'toast';
        }, 4000);
    };

    let projectsList = [];

    const loadAdminProjects = async () => {
        const tbody = document.getElementById('admin-projects-table-body');
        const countEl = document.getElementById('project-count');

        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                projectsList = await response.json();
                if (countEl) countEl.textContent = projectsList.length;
                renderAdminProjects(projectsList);
            }
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar projetos do servidor.</td></tr>';
            }
        }
    };

    const renderAdminProjects = (projects) => {
        const tbody = document.getElementById('admin-projects-table-body');
        if (!tbody) return;

        if (projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Nenhum projeto cadastrado. Clique no botão "Novo Projeto" para começar!</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        projects.forEach(p => {
            const tagsHtml = p.tags ? p.tags.map(t => `<span class="badge-mini">${t}</span>`).join(' ') : '';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${p.id}</strong></td>
                <td><i class="${p.iconClass || 'fa-solid fa-code'}"></i></td>
                <td>
                    <strong>${p.title}</strong>
                    <div class="text-muted small">${p.shortDescription || ''}</div>
                </td>
                <td><span class="project-category-badge">${p.category}</span></td>
                <td>${tagsHtml}</td>
                <td>
                    <div class="table-actions">
                        <a href="project.html?id=${p.id}" target="_blank" class="btn-action view" title="Visualizar Página"><i class="fa-solid fa-eye"></i></a>
                        <button class="btn-action edit" onclick="window.editProject(${p.id})" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-action delete" onclick="window.deleteProject(${p.id})" title="Excluir"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const openModalBtn = document.getElementById('btn-open-new-project-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const cancelModalBtn = document.getElementById('modal-cancel-btn');
    const projectForm = document.getElementById('project-form');

    const openModal = (isEdit = false, project = null) => {
        projectForm.reset();
        document.getElementById('form-project-id').value = '';

        if (isEdit && project) {
            modalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar Projeto #${project.id}`;
            document.getElementById('form-project-id').value = project.id;
            document.getElementById('form-title').value = project.title || '';
            document.getElementById('form-category').value = project.category || 'backend';
            document.getElementById('form-icon').value = project.iconClass || 'fa-solid fa-server';
            document.getElementById('form-short-desc').value = project.shortDescription || '';
            document.getElementById('form-long-desc').value = project.longDescription || '';
            document.getElementById('form-architecture').value = project.architecture || '';
            document.getElementById('form-tags').value = project.tags ? project.tags.join(', ') : '';
            document.getElementById('form-highlights').value = project.highlights ? project.highlights.join('\n') : '';
            document.getElementById('form-source-url').value = project.sourceUrl || '';
            document.getElementById('form-demo-url').value = project.demoUrl || '';
        } else {
            modalTitle.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Adicionar Novo Projeto`;
        }

        modal.classList.add('show');
    };

    const closeModal = () => {
        modal.classList.remove('show');
    };

    if (openModalBtn) openModalBtn.addEventListener('click', () => openModal(false));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('form-submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
            submitBtn.disabled = true;

            const id = document.getElementById('form-project-id').value;
            const isEdit = Boolean(id);

            const tagsRaw = document.getElementById('form-tags').value;
            const tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);

            const highlightsRaw = document.getElementById('form-highlights').value;
            const highlights = highlightsRaw.split('\n').map(h => h.trim()).filter(h => h.length > 0);

            const payload = {
                title: document.getElementById('form-title').value.trim(),
                category: document.getElementById('form-category').value,
                iconClass: document.getElementById('form-icon').value,
                shortDescription: document.getElementById('form-short-desc').value.trim(),
                longDescription: document.getElementById('form-long-desc').value.trim(),
                architecture: document.getElementById('form-architecture').value.trim(),
                tags: tags,
                highlights: highlights,
                sourceUrl: document.getElementById('form-source-url').value.trim() || null,
                demoUrl: document.getElementById('form-demo-url').value.trim() || null
            };

            try {
                const url = isEdit ? `/api/projects/${id}` : '/api/projects';
                const method = isEdit ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Admin-Key': adminKey
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    showToast(`Projeto ${isEdit ? 'atualizado' : 'criado'} com sucesso!`, 'success');
                    closeModal();
                    loadAdminProjects();
                } else if (response.status === 401) {
                    showToast('Sessão expirada ou não autorizada. Faça login novamente.', 'error');
                    showLockScreen('Autenticação necessária.');
                } else {
                    const err = await response.json();
                    let errMsg = err.message || 'Erro ao salvar projeto.';
                    if (err.validationErrors) {
                        errMsg = Object.values(err.validationErrors).join(' ');
                    }
                    showToast(errMsg, 'error');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                showToast('Erro de conexão com o servidor.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    window.editProject = (id) => {
        const project = projectsList.find(p => p.id === id);
        if (project) {
            openModal(true, project);
        }
    };

    window.deleteProject = async (id) => {
        if (!confirm(`Tem certeza que deseja excluir o projeto #${id}?`)) return;

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'X-Admin-Key': adminKey }
            });

            if (response.status === 204 || response.ok) {
                showToast('Projeto removido com sucesso!', 'success');
                loadAdminProjects();
            } else if (response.status === 401) {
                showToast('Acesso não autorizado.', 'error');
                showLockScreen('Autenticação necessária.');
            } else {
                showToast('Erro ao remover o projeto.', 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            showToast('Erro de conexão ao excluir.', 'error');
        }
    };

    const loadContactMessages = async () => {
        const tbody = document.getElementById('admin-messages-table-body');
        const countEl = document.getElementById('message-count');

        try {
            const response = await fetch('/api/contact', {
                headers: { 'X-Admin-Key': adminKey }
            });

            if (response.ok) {
                const messages = await response.json();
                if (countEl) countEl.textContent = messages.length;
                renderContactMessages(messages);
            } else if (response.status === 401) {
                showLockScreen('Autenticação necessária para ler mensagens.');
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Erro ao carregar mensagens.</td></tr>';
            }
        }
    };

    const renderContactMessages = (messages) => {
        const tbody = document.getElementById('admin-messages-table-body');
        if (!tbody) return;

        if (messages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Nenhuma mensagem recebida ainda.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        messages.forEach(m => {
            const date = m.createdAt ? new Date(m.createdAt).toLocaleString('pt-BR') : '-';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${m.id}</strong></td>
                <td><small>${date}</small></td>
                <td><strong>${m.name}</strong></td>
                <td><a href="mailto:${m.email}" class="highlight">${m.email}</a></td>
                <td>${m.message}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    if (adminKey) {
        verifyAuth(adminKey);
    } else {
        showLockScreen();
    }
});
