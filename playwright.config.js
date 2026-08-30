const { defineConfig } = require('@playwright/test');

const viewports = [
    ['mobile-320', 320, 720],
    ['mobile-375', 375, 812],
    ['mobile-430', 430, 932],
    ['tablet-768', 768, 1024],
    ['laptop-1024', 1024, 768],
    ['desktop-1280', 1280, 900],
    ['desktop-1440', 1440, 1000],
    ['ultrawide-1920', 1920, 1080]
];

module.exports = defineConfig({
    testDir: './tests/visual',
    timeout: 45_000,
    expect: { timeout: 8_000 },
    fullyParallel: false,
    workers: 1,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8085',
        browserName: 'chromium',
        colorScheme: 'dark',
        reducedMotion: 'reduce',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    },
    projects: viewports.map(([name, width, height]) => ({
        name,
        use: { viewport: { width, height } }
    })),
    webServer: {
        command: 'mvn spring-boot:run',
        url: 'http://127.0.0.1:8085',
        reuseExistingServer: true,
        timeout: 120_000,
        env: {
            ...process.env,
            DB_URL: 'jdbc:h2:mem:portfolio_visual;DB_CLOSE_DELAY=-1',
            DB_USERNAME: 'sa',
            DB_PASSWORD: '',
            JPA_DDL_AUTO: 'create-drop',
            PORT: '8085',
            SPRING_DATASOURCE_DRIVER_CLASS_NAME: 'org.h2.Driver',
            SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT: 'org.hibernate.dialect.H2Dialect',
            ADMIN_SECRET_KEY: 'admin123'
        }
    }
});
