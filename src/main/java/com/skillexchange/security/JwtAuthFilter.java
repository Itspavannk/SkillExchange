package com.skillexchange.security;

import com.skillexchange.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Allow auth endpoints without token
        if (path.startsWith("/auth/login") || path.startsWith("/auth/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            if (jwtUtil.isTokenValid(token)) {

                Long userId = jwtUtil.extractUserId(token);
                System.out.println("JWT VALIDATED: " + token);

                if (userId != null) {
                            userRepository.findById(userId).ifPresent(user -> {

                                String role = user.getRole().toUpperCase();

                                // ensure correct format for Spring Security
                                if (!role.startsWith("ROLE_")) {
                                    role = "ROLE_" + role;
                                }

                                List<SimpleGrantedAuthority> authorities = List.of(
                                    new SimpleGrantedAuthority(role)
                                );

                                UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(user, null, authorities);

                                SecurityContextHolder.getContext().setAuthentication(auth);
                            });
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}