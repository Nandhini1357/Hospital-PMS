package com.examly.springapp.repository;

import com.examly.springapp.model.SecurityAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityAuditLogRepository extends JpaRepository<SecurityAuditLog, Long> {
    List<SecurityAuditLog> findByUserIdOrderByTimestampDesc(Long userId);
    List<SecurityAuditLog> findTop50ByOrderByTimestampDesc();
    List<SecurityAuditLog> findAllByOrderByTimestampDesc();
}
