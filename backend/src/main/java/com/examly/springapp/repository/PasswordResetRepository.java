package com.examly.springapp.repository;

import com.examly.springapp.model.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findTopByEmailAndOtpCodeAndIsUsedFalseOrderByCreatedAtDesc(String email, String otpCode);
}
