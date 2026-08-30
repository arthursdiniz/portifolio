# 🚀 <Diniz.Dev/> - Portfolio Backend API & Web Application

Portfólio profissional e sistema web desenvolvido com **Java 25**, **Spring Boot 4**, **Spring Data JPA**, **PostgreSQL** e arquitetura RESTful.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: Java 25
- **Framework Principal**: Spring Boot (Spring Web, Spring Data JPA, Bean Validation)
- **Banco de Dados**: PostgreSQL (Produção/Desenvolvimento) & H2 (Testes automatizados)
- **Documentação de API**: OpenAPI 3 / Swagger UI (`springdoc-openapi`)
- **Segurança**: Interceptor de autenticação administrativa (`X-Admin-Key`)
- **Testes**: JUnit 5, Mockito, MockMvc e Playwright
- **Containerização**: Docker, Docker Compose
- **Front-end**: HTML5 semântico, CSS3 responsivo e Vanilla JavaScript
- **Interface**: Lucide Icons e IBM Plex Sans/Mono, servidos localmente

---

## 🏛️ Padrões de Arquitetura & Engenharia

- **Layered Architecture**: Separação clara entre `Controller`, `Service` / `ServiceImpl`, `Repository` e `Domain`.
- **Data Transfer Objects (DTOs)**: Isolamento do modelo de domínio com validações estritas (`@Valid`, `@NotBlank`, `@Size`, `@Email`).
- **Tratamento Global de Exceções**: `@RestControllerAdvice` padronizando retornos de erro em JSON com status HTTP adequados.
- **Segurança Granular**:
  - Visitantes e recrutadores navegam livremente; a área pública exibe apenas os dados profissionais de contato, sem formulário de envio.
  - Endpoints de modificação (`POST`, `PUT`, `DELETE`) e leitura de mensagens privadas exigem chave administrativa secreta.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- JDK 25 instalado
- Docker & Docker Compose (ou PostgreSQL instalado localmente)

### 1. Clonar o repositório
```bash
git clone https://github.com/arthursdiniz/portifolio.git
cd portifolio
```

### 2. Subir o Banco de Dados PostgreSQL (via Docker)
```bash
docker compose up -d
```

### 3. Executar a Aplicação Spring Boot
- **No Prompt de Comando (CMD)**:
  ```cmd
  mvnw spring-boot:run
  ```
- **No PowerShell / Linux / Mac**:
  ```bash
  ./mvnw spring-boot:run
  ```

---

## 📑 Endpoints e Documentação da API

Após iniciar a aplicação:
- 🌐 **Aplicação Web (Home)**: [http://localhost:8080](http://localhost:8080)
- 📑 **Documentação Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- ⚙️ **Painel Administrativo**: [http://localhost:8080/admin.html](http://localhost:8080/admin.html)

### Principais Endpoints REST:
| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| `GET` | `/api/projects` | Listar projetos com filtro e busca | Público |
| `GET` | `/api/projects/{id}` | Obter detalhes do projeto | Público |
| `POST` | `/api/contact` | Enviar mensagem de contato | Público |
| `POST` | `/api/auth/verify` | Validar chave administrativa | Público |
| `POST` | `/api/projects` | Criar novo projeto | Requer `X-Admin-Key` |
| `PUT` | `/api/projects/{id}` | Atualizar projeto | Requer `X-Admin-Key` |
| `DELETE` | `/api/projects/{id}` | Remover projeto | Requer `X-Admin-Key` |
| `GET` | `/api/contact` | Listar mensagens de contato | Requer `X-Admin-Key` |

---

## 🧪 Executando os Testes Automatizados

### Back-end

```bash
./mvnw test
```
*Os testes são executados automaticamente em um banco H2 isolado em memória, permitindo execução contínua em qualquer ambiente de CI/CD (ex: GitHub Actions).*

### Interface responsiva

```bash
npm install
npx playwright install chromium
npm run test:visual
```

Os testes de interface cobrem a página pública, os detalhes de projeto e o painel administrativo em larguras de 320, 375, 430, 768, 1024, 1280, 1440 e 1920 pixels.

---

## 🔒 Segurança em Produção

- Credenciais de banco de dados e chaves de segurança são injetadas via variáveis de ambiente (`${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`, `${ADMIN_SECRET_KEY}`).
- Arquivos `.env` e arquivos locais de IDE estão protegidos no `.gitignore`.
- Stack traces internas de erro são desabilitadas em produção (`server.error.include-stacktrace: never`).
