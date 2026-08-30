(function () {
    'use strict';

    const LEGACY_ICON_MAP = {
        'fa-solid fa-server': 'server',
        'fa-solid fa-leaf': 'sprout',
        'fa-solid fa-bolt': 'zap',
        'fa-solid fa-wallet': 'wallet-cards',
        'fa-solid fa-gamepad': 'gamepad-2',
        'fa-solid fa-graduation-cap': 'graduation-cap',
        'fa-solid fa-shield-halved': 'shield-check',
        'fa-solid fa-credit-card': 'credit-card',
        'fa-solid fa-code': 'code-2'
    };

    const escapeHTML = (value = '') => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const safeExternalUrl = (value) => {
        if (!value) return null;

        try {
            const url = new URL(value);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
        } catch {
            return null;
        }
    };

    const iconNameFromClass = (iconClass) => LEGACY_ICON_MAP[iconClass] || 'code-2';

    const refreshIcons = (root = document) => {
        if (!window.lucide || typeof window.lucide.createIcons !== 'function') return;
        window.lucide.createIcons({
            attrs: {
                'aria-hidden': 'true',
                'stroke-width': 1.8
            },
            root
        });
    };

    const showToast = (message, type = 'success') => {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const icon = type === 'success' ? 'circle-check' : 'circle-alert';
        toast.className = `toast toast-${type} show`;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
        toast.innerHTML = `<i data-lucide="${icon}"></i><span>${escapeHTML(message)}</span>`;
        refreshIcons(toast);

        window.clearTimeout(showToast.timeoutId);
        showToast.timeoutId = window.setTimeout(() => {
            toast.className = 'toast';
        }, 4000);
    };

    const initializeShell = () => {
        const yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        const navbar = document.querySelector('.navbar');
        const nav = document.getElementById('primary-navigation');
        const toggle = document.querySelector('.nav-toggle');
        const scrim = document.querySelector('.nav-scrim');

        const setScrolledState = () => {
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 24 || !document.body.classList.contains('page-home'));
        };

        const setNavigationOpen = (isOpen) => {
            if (!nav || !toggle) return;
            nav.classList.toggle('nav-active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
            document.body.classList.toggle('nav-open', isOpen);

            const icon = toggle.querySelector('[data-lucide]');
            if (icon) icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            refreshIcons(toggle);
        };

        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                setNavigationOpen(toggle.getAttribute('aria-expanded') !== 'true');
            });

            nav.querySelectorAll('a, button').forEach((item) => {
                item.addEventListener('click', () => setNavigationOpen(false));
            });
        }

        if (scrim) scrim.addEventListener('click', () => setNavigationOpen(false));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setNavigationOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setNavigationOpen(false);
        });

        window.addEventListener('scroll', setScrolledState, { passive: true });
        setScrolledState();
        refreshIcons();
    };

    window.SiteUI = {
        escapeHTML,
        iconNameFromClass,
        refreshIcons,
        safeExternalUrl,
        showToast
    };

    document.addEventListener('DOMContentLoaded', initializeShell);
}());
