package com.examly.springapp.security;

import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration.pharmacist:28800000}")
    private long pharmacistExpirationMs;

    @Value("${app.jwt.expiration.manager:43200000}")
    private long managerExpirationMs;

    @Value("${app.jwt.expiration.admin:86400000}")
    private long adminExpirationMs;

    @Value("${app.jwt.expiration.default:28800000}")
    private long defaultExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public long getExpirationMsForRole(Role role) {
        if (role == null) return defaultExpirationMs;
        switch (role) {
            case PHARMACIST:
            case DOCTOR:
            case PATIENT:
                return pharmacistExpirationMs; // 8 hours
            case STORE_MANAGER:
            case FINANCE:
                return managerExpirationMs;    // 12 hours
            case ADMIN:
                return adminExpirationMs;      // 24 hours
            default:
                return defaultExpirationMs;
        }
    }

    public String generateToken(User user) {
        Date now = new Date();
        long expirationMs = getExpirationMsForRole(user.getRole());
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .claim("fullName", user.getFullName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return (String) claims.get("role");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
