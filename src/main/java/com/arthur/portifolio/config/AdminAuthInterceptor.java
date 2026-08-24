package com.arthur.portifolio.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Value("${portfolio.admin.secret-key:admin123}")
    private String adminSecretKey;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String method = request.getMethod();
        String path = request.getRequestURI();

        if (HttpMethod.OPTIONS.matches(method)) {
            return true;
        }

        if (HttpMethod.GET.matches(method) && path.startsWith("/api/projects")) {
            return true;
        }

        if (HttpMethod.POST.matches(method) && path.equals("/api/contact")) {
            return true;
        }

        if (path.startsWith("/api/auth")) {
            return true;
        }

        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui") || path.startsWith("/h2-console")) {
            return true;
        }

        String providedKey = request.getHeader("X-Admin-Key");
        if (providedKey != null && providedKey.equals(adminSecretKey)) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Acesso restrito: Você precisa fornecer uma chave administrativa válida para modificar o conteúdo.\"}");
        return false;
    }
}
