package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Student;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    List<Student> findByName(String name);

    List<Student> findByEmail(String email);

    List<Student> findByDepartment(String department);

    List<Student> findByNameContainingIgnoreCase(String name);
}