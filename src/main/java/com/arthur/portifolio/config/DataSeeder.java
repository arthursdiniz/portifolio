package com.arthur.portifolio.config;

import com.arthur.portifolio.domain.Project;
import com.arthur.portifolio.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedProjects(ProjectRepository projectRepository) {
        return args -> {
            if (projectRepository.count() == 0) {
                Project ecommerce = Project.builder()
                        .title("E-Commerce RESTful API")
                        .shortDescription("API RESTful robusta desenvolvida em Java e Spring Boot com autenticação stateless JWT, controle de acesso e banco de dados relacional.")
                        .longDescription("Projeto completo de backend simulando a infraestrutura de um e-commerce moderno. Implementa gerenciamento de produtos, pedidos, clientes e pagamentos. Conta com controle granular de perfis de usuário (ADMIN/USER), segurança contra vulnerabilidades comuns (CORS, CSRF, SQL Injection) e documentação interativa com Swagger.")
                        .category("backend")
                        .iconClass("fa-solid fa-server")
                        .tags(Arrays.asList("Java", "Spring Boot", "Spring Security", "JWT", "JPA/Hibernate", "PostgreSQL", "Docker"))
                        .highlights(Arrays.asList(
                                "Autenticação e Autorização Stateless com tokens JWT e Spring Security 6",
                                "Arquitetura limpa em camadas com DTOs, Bean Validation e Tratamento Global de Exceções",
                                "Paginação e ordenação dinâmica em consultas com Spring Data JPA",
                                "Containerização completa com Docker e Docker Compose",
                                "Testes automatizados cobrindo controllers e services com JUnit 5 e Mockito"
                        ))
                        .architecture("Arquitetura em Camadas (Layered Architecture) com separação estrita de Controller, Service, DTO e Repository")
                        .sourceUrl("https://github.com/arthursdiniz/ecommerce-spring-api")
                        .demoUrl("https://ecommerce-api-demo.com")
                        .createdAt(LocalDateTime.now().minusDays(15))
                        .build();

                Project taskManager = Project.builder()
                        .title("Task & Notifications Microservice")
                        .shortDescription("Sistema de gerenciamento assíncrono de tarefas e disparos de notificações com mensageria e cache de alta performance.")
                        .longDescription("Microsserviço de agendamento e execução de tarefas em segundo plano. Utiliza filas de mensageria para desacoplar requisições HTTP de alta latência e Redis para cache de consultas frequentes, garantindo baixo tempo de resposta e alta disponibilidade.")
                        .category("backend")
                        .iconClass("fa-solid fa-bolt")
                        .tags(Arrays.asList("Java", "Spring Boot", "RabbitMQ", "Redis", "Docker", "Spring Data JPA"))
                        .highlights(Arrays.asList(
                                "Processamento assíncrono e confiável de eventos via filas RabbitMQ",
                                "Estratégia de Cache-Aside com Redis e Spring Cache para otimização de latência",
                                "Mecanismos de Retry e Dead Letter Queue (DLQ) para mensagens com falha",
                                "Health checks e monitoramento de métricas via Spring Boot Actuator"
                        ))
                        .architecture("Arquitetura Orientada a Eventos (EDA) com padrão Publisher-Subscriber")
                        .sourceUrl("https://github.com/arthursdiniz/task-notification-service")
                        .demoUrl(null)
                        .createdAt(LocalDateTime.now().minusDays(10))
                        .build();

                Project financialWallet = Project.builder()
                        .title("Financial Wallet Core API")
                        .shortDescription("API financeira transacional focada em consistência ACID, transferências seguras e histórico de extratos bancários.")
                        .longDescription("API focada em regras de negócio bancárias complexas, como transferências entre contas, depósitos, saques com estorno automático e geração de extratos detalhados. Foco total em consistência de dados, locking otimista/pessimista e integridade transacional.")
                        .category("backend")
                        .iconClass("fa-solid fa-wallet")
                        .tags(Arrays.asList("Java", "Spring Boot", "JPA/Hibernate", "Flyway", "H2 Database", "JUnit 5"))
                        .highlights(Arrays.asList(
                                "Controle transacional rigoroso com @Transactional e garantia ACID",
                                "Controle de concorrência com Optimistic Locking para evitar saldo negativo duplo",
                                "Versionamento e migrações de esquema do banco de dados com Flyway",
                                "Validações customizadas de CPF/CNPJ e regras de limites operacionais"
                        ))
                        .architecture("Domain-Driven Design (DDD) simplificado com entidades ricas e regras de negócio encapsuladas")
                        .sourceUrl("https://github.com/arthursdiniz/financial-wallet-api")
                        .demoUrl(null)
                        .createdAt(LocalDateTime.now().minusDays(5))
                        .build();

                Project game = Project.builder()
                        .title("Space Explorer 2D")
                        .shortDescription("Um jogo de plataforma e exploração espacial onde o jogador coleta recursos. Focado em mecânicas fluidas e pixel art.")
                        .longDescription("Jogo 2D com temática espacial desenvolvido com física personalizada, sistema de coleta de recursos, árvore de habilidades e chefes desafiadores. Foco no polimento da experiência do usuário (Game Feel) e modularidade do código em C#.")
                        .category("game")
                        .iconClass("fa-solid fa-gamepad")
                        .tags(Arrays.asList("Unity", "C#", "Game Design", "Pixel Art"))
                        .highlights(Arrays.asList(
                                "Máquina de Estados Finita (FSM) para controle de estados do jogador e IA inimiga",
                                "Sistema modular de inventário e save/load em formato JSON criptografado",
                                "Otimização de performance com Object Pooling para projéteis e partículas",
                                "Trilha sonora e efeitos de áudio integrados com mixagem dinâmica"
                        ))
                        .architecture("Component-Based Architecture com State Machines e Scriptable Objects")
                        .sourceUrl("https://github.com/arthursdiniz/space-explorer")
                        .demoUrl("https://arthur.itch.io/space-explorer")
                        .createdAt(LocalDateTime.now().minusDays(30))
                        .build();

                Project dataAnalysis = Project.builder()
                        .title("Análise de Dados de Saúde & ML")
                        .shortDescription("Projeto acadêmico analisando grandes datasets da área de saúde para prever tendências usando machine learning básico.")
                        .longDescription("Pipeline de extração, limpeza e análise exploratória de dados de saúde pública (SUS), identificando padrões regionais e prevendo tempo de internação com algoritmos de regressão e árvores de decisão.")
                        .category("academic")
                        .iconClass("fa-solid fa-graduation-cap")
                        .tags(Arrays.asList("Python", "Pandas", "Scikit-Learn", "Data Science", "Jupyter"))
                        .highlights(Arrays.asList(
                                "Limpeza e tratamento de dados com Pandas e NumPy",
                                "Visualizações estatísticas e mapas de calor com Seaborn e Matplotlib",
                                "Modelos preditivos treinados com validação cruzada (Cross-Validation)"
                        ))
                        .architecture("Pipeline ETL com Análise Exploratória (EDA) e Modelagem Preditiva")
                        .sourceUrl("https://github.com/arthursdiniz/health-data-analysis")
                        .demoUrl(null)
                        .createdAt(LocalDateTime.now().minusDays(45))
                        .build();

                projectRepository.saveAll(Arrays.asList(ecommerce, taskManager, financialWallet, game, dataAnalysis));
            }
        };
    }
}

