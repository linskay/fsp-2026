package ru.fsp.careerarena.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.fsp.careerarena.security.JwtAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig() {
        this.jwtAuthenticationFilter = null;
    }

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Public OpenAPI Documentation & Actuator
                .requestMatchers(
                    "/",
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/actuator/**"
                ).permitAll()

                // 2. Public Authentication, OAuth & Registration Endpoints
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/api/v1/public/**",
                    "/oauth2/**",
                    "/login/**"
                ).permitAll()

                // 3. Public Read/Browse Endpoints (Tasks, Public Vacancies, Candidate Profiles, FSP Registry)
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/candidates/**",
                    "/api/v1/vacancies/**",
                    "/api/v1/tasks/**",
                    "/api/v1/fsp/**",
                    "/api/v1/tests/categories",
                    "/api/v1/tests/cooldown/**",
                    "/api/v1/leetcode/**",
                    "/api/v1/sandbox/**",
                    "/api/v1/system/**"
                ).permitAll()

                // 4. Strict RBAC: Employer Only Endpoints (Защита функционала работодателя от соискателей)
                .requestMatchers(
                    "/api/v1/vacancies/employer/**",
                    "/api/v1/assessments/assign",
                    "/api/v1/assessments/review",
                    "/api/v1/integrations/hh/import",
                    "/api/v1/employers/profile/**"
                ).hasAnyRole("EMPLOYER", "ADMIN")

                // 5. Strict RBAC: Candidate Only Endpoints (Отклики, сдача заданий, принятие офферов)
                .requestMatchers(
                    "/api/v1/offers/*/accept",
                    "/api/v1/offers/*/decline",
                    "/api/v1/applications",
                    "/api/v1/assessments/submit",
                    "/api/v1/tests/start",
                    "/api/v1/tests/submit"
                ).hasAnyRole("CANDIDATE", "ADMIN")

                // 6. Common Authenticated (Chat, Notifications, Audit, Assessment viewing)
                .requestMatchers(
                    "/api/v1/offers/**",
                    "/api/v1/applications/**",
                    "/api/v1/chat/**",
                    "/api/v1/notifications/**",
                    "/api/v1/assessments/**",
                    "/api/v1/interviews/**",
                    "/api/v1/audit/**",
                    "/api/v1/webhooks/**",
                    "/api/v1/ai-summary/**",
                    "/api/v1/ai/**",
                    "/api/v1/users/**",
                    "/api/v1/files/**",
                    "/ws/**"
                ).permitAll()

                .anyRequest().authenticated()
            );

        if (jwtAuthenticationFilter != null) {
            http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        }

        http.oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("/api/v1/auth/oauth2/success", true)
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
