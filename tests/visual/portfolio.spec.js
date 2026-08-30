const { test, expect } = require('@playwright/test');

const attachRuntimeChecks = (page) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    return errors;
};

const expectNoHorizontalOverflow = async (page) => {
    await page.waitForTimeout(100);
    const result = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const allowedOverflow = '.table-responsive, .code-window-body, .nav-links, .reveal-left, .reveal-right, .reveal-up:not(.active)';
        const offenders = [...document.querySelectorAll('body *')]
            .filter((element) => {
                const rect = element.getBoundingClientRect();
                const visible = getComputedStyle(element).display !== 'none';
                const outside = rect.left < -1 || rect.right > viewport + 1;
                return visible && outside && !element.closest(allowedOverflow);
            })
            .slice(0, 10)
            .map((element) => ({
                tag: element.tagName,
                id: element.id,
                className: typeof element.className === 'string' ? element.className : element.getAttribute('class')
            }));
        return {
            viewport,
            scrollWidth: document.scrollingElement.scrollWidth,
            offenders
        };
    });
    expect(result.scrollWidth, `largura rolável da página: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewport);
    expect(result.offenders, `overflow horizontal: ${JSON.stringify(result)}`).toEqual([]);
};

test('portfólio público carrega, filtra e responde ao viewport', async ({ page }, testInfo) => {
    const errors = attachRuntimeChecks(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Backend sólido/i })).toBeVisible();
    await expect(page.locator('#projects-grid')).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('.project-card')).toHaveCount(5);

    await page.getByRole('button', { name: 'Backend', exact: true }).click();
    await expect(page.locator('.project-card')).toHaveCount(3);
    await page.getByRole('button', { name: 'Todos', exact: true }).click();
    await expect(page.locator('.project-card')).toHaveCount(5);

    if (testInfo.project.use.viewport.width <= 768) {
        const toggle = page.locator('.nav-toggle');
        await expect(toggle).toBeVisible();
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    }

    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath('home-full.png'), fullPage: true });
    expect(errors).toEqual([]);
});

test('detalhe do projeto preserva conteúdo e ações', async ({ page }, testInfo) => {
    const errors = attachRuntimeChecks(page);
    await page.goto('/project.html?id=1');

    await expect(page.locator('#project-content')).toBeVisible();
    await expect(page.locator('#detail-title')).not.toHaveText('Nome do Projeto');
    await expect(page.locator('#detail-highlights li')).toHaveCount(5);
    await expectNoHorizontalOverflow(page);

    if (['mobile-375', 'tablet-768', 'desktop-1440'].includes(testInfo.project.name)) {
        await page.screenshot({ path: testInfo.outputPath('project-full.png'), fullPage: true });
    }
    expect(errors).toEqual([]);
});

test('painel autentica e modal funciona sem alterar dados', async ({ page }, testInfo) => {
    const errors = attachRuntimeChecks(page);
    await page.goto('/admin.html');

    await expect(page.getByRole('heading', { name: 'Desbloquear painel' })).toBeVisible();
    await page.getByLabel('Chave de segurança').fill('admin123');
    await page.getByRole('button', { name: /Entrar no painel/i }).click();
    await expect(page.getByRole('heading', { name: 'Painel de gerenciamento' })).toBeVisible();
    await expect(page.locator('#admin-projects-table-body tr')).toHaveCount(5);

    await page.getByRole('button', { name: /Novo projeto/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expectNoHorizontalOverflow(page);

    if (['mobile-375', 'tablet-768', 'desktop-1440'].includes(testInfo.project.name)) {
        await page.screenshot({ path: testInfo.outputPath('admin-full.png'), fullPage: true });
    }
    expect(errors).toEqual([]);
});
