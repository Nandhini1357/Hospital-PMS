package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmployeeId(String employeeId);

    Optional<User> findByLicenceNumber(String licenceNumber);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    @Query("SELECT u FROM User u WHERE u.email = :credential OR u.employeeId = :credential OR u.licenceNumber = :credential")
    Optional<User> findByCredential(@Param("credential") String credential);
}
