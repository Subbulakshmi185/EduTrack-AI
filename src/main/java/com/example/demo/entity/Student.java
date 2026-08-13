package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Department is required")
    @Column(name = "department", length = 100)
    private String department;

    @Email(message = "Email should be valid")
    @Column(name = "email", unique = true, length = 100)
    private String email;

    // Smart Student Analytics

    @Min(value = 0, message = "Attendance cannot be negative")
    @Max(value = 100, message = "Attendance cannot exceed 100")
    @Column(name = "attendance")
    private Double attendance;

    @Min(value = 0, message = "Marks cannot be negative")
    @Max(value = 100, message = "Marks cannot exceed 100")
    @Column(name = "marks")
    private Double marks;

    @Min(value = 0, message = "Assignment completion cannot be negative")
    @Max(value = 100, message = "Assignment completion cannot exceed 100")
    @Column(name = "assignment_completion")
    private Double assignmentCompletion;

    @Min(value = 0, message = "Participation cannot be negative")
    @Max(value = 100, message = "Participation cannot exceed 100")
    @Column(name = "participation")
    private Double participation;
}