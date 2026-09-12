package com.examly.springapp.controller;

import com.examly.springapp.model.SecurityAuditLog;
import com.examly.springapp.repository.SecurityAuditLogRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Audit Logging", description = "Administrator endpoints for inspecting security audit logs")
@RestController
@RequestMapping("/api/admin/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    @Autowired
    private SecurityAuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<SecurityAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }
}
