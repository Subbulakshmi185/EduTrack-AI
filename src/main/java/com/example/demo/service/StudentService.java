package com.example.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import com.example.demo.exception.ResourceNotFoundException;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // ============================================================
    // CREATE STUDENT
    // ============================================================

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // ============================================================
    // GET ALL STUDENTS
    // ============================================================

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ============================================================
    // PAGINATION + SORTING
    // ============================================================

    public Page<Student> getAllStudentsPaginated(
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return studentRepository.findAll(pageable);
    }

    // ============================================================
    // SEARCH
    // ============================================================

    public List<Student> searchByName(String name) {
        return studentRepository.findByName(name);
    }

    public List<Student> searchByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public List<Student> searchByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    public List<Student> searchByNameContains(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }

    // ============================================================
    // GET STUDENT BY ID
    // ============================================================

    public Optional<Student> getStudentById(Integer id) {
        return studentRepository.findById(id);
    }

    // ============================================================
    // UPDATE STUDENT
    // ============================================================

    public Student updateStudent(
            Integer id,
            Student studentDetails) {

        return studentRepository.findById(id)
                .map(student -> {

                    student.setName(studentDetails.getName());
                    student.setDepartment(studentDetails.getDepartment());
                    student.setEmail(studentDetails.getEmail());

                    // Smart analytics fields
                    student.setAttendance(
                            studentDetails.getAttendance()
                    );

                    student.setMarks(
                            studentDetails.getMarks()
                    );

                    student.setAssignmentCompletion(
                            studentDetails.getAssignmentCompletion()
                    );

                    student.setParticipation(
                            studentDetails.getParticipation()
                    );

                    return studentRepository.save(student);

                })
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        ));
    }

    // ============================================================
    // DELETE STUDENT
    // ============================================================

    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }

    // ============================================================
    // SMART STUDENT ANALYTICS
    // ============================================================

    /*
     * Checks whether the student has complete analytics data.
     *
     * We do NOT want:
     *
     * null attendance
     * null marks
     * null assignments
     * null participation
     *
     * to become:
     *
     * 0% score
     * HIGH risk
     * AT_RISK
     *
     * Instead, we return DATA_INCOMPLETE.
     */

    public boolean hasCompleteAnalyticsData(Student student) {

        return student.getAttendance() != null
                && student.getMarks() != null
                && student.getAssignmentCompletion() != null
                && student.getParticipation() != null;
    }

    // ============================================================
    // SUCCESS SCORE
    // ============================================================

    public double calculateSuccessScore(Student student) {

        // Don't calculate a fake 0 score
        // when the data is missing.
        if (!hasCompleteAnalyticsData(student)) {
            return 0.0;
        }

        double attendance = student.getAttendance();
        double marks = student.getMarks();
        double assignments = student.getAssignmentCompletion();
        double participation = student.getParticipation();

        /*
         * Success Score Formula
         *
         * Attendance       = 25%
         * Marks            = 40%
         * Assignments      = 20%
         * Participation    = 15%
         */

        double score =
                (attendance * 0.25)
                + (marks * 0.40)
                + (assignments * 0.20)
                + (participation * 0.15);

        return Math.round(score * 100.0) / 100.0;
    }

    // ============================================================
    // RISK LEVEL
    // ============================================================

    public String calculateRiskLevel(Student student) {

        // Missing data should NOT make a student HIGH risk.
        if (!hasCompleteAnalyticsData(student)) {
            return "DATA_INCOMPLETE";
        }

        double score = calculateSuccessScore(student);

        if (score >= 80) {
            return "LOW";
        }

        if (score >= 60) {
            return "MEDIUM";
        }

        return "HIGH";
    }

    // ============================================================
    // PERFORMANCE STATUS
    // ============================================================

    public String calculatePerformanceStatus(Student student) {

        // Missing data means we cannot judge performance yet.
        if (!hasCompleteAnalyticsData(student)) {
            return "DATA_INCOMPLETE";
        }

        double score = calculateSuccessScore(student);

        if (score >= 85) {
            return "EXCELLENT";
        }

        if (score >= 70) {
            return "GOOD";
        }

        if (score >= 50) {
            return "NEEDS_ATTENTION";
        }

        return "AT_RISK";
    }

    // ============================================================
    // STUDENT ANALYTICS
    // ============================================================

    public Map<String, Object> getStudentAnalytics(Integer id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        ));

        boolean completeData =
                hasCompleteAnalyticsData(student);

        double score =
                calculateSuccessScore(student);

        String risk =
                calculateRiskLevel(student);

        String status =
                calculatePerformanceStatus(student);

        Map<String, Object> analytics =
                new HashMap<>();

        // Student information
        analytics.put(
                "studentId",
                student.getId()
        );

        analytics.put(
                "studentName",
                student.getName()
        );

        analytics.put(
                "department",
                student.getDepartment()
        );

        // Analytics data
        analytics.put(
                "attendance",
                student.getAttendance()
        );

        analytics.put(
                "marks",
                student.getMarks()
        );

        analytics.put(
                "assignmentCompletion",
                student.getAssignmentCompletion()
        );

        analytics.put(
                "participation",
                student.getParticipation()
        );

        // Intelligence results
        analytics.put(
                "dataComplete",
                completeData
        );

        analytics.put(
                "successScore",
                score
        );

        analytics.put(
                "riskLevel",
                risk
        );

        analytics.put(
                "status",
                status
        );

        // Helpful message for dashboard
        if (!completeData) {

            analytics.put(
                    "message",
                    "Analytics data is incomplete. Please enter attendance, marks, assignment completion and participation."
            );

        } else {

            analytics.put(
                    "message",
                    generateInsight(student, score, risk, status)
            );
        }

        return analytics;
    }

    // ============================================================
    // AI-STYLE INSIGHT
    // ============================================================

    private String generateInsight(
            Student student,
            double score,
            String risk,
            String status) {

        if (status.equals("EXCELLENT")) {

            return "Excellent performance. "
                    + student.getName()
                    + " is demonstrating strong academic "
                    + "and engagement indicators.";

        }

        if (status.equals("GOOD")) {

            return "Good overall performance. "
                    + student.getName()
                    + " is progressing well but has room "
                    + "for further improvement.";

        }

        if (status.equals("NEEDS_ATTENTION")) {

            return "This student may benefit from "
                    + "additional academic support and "
                    + "closer performance monitoring.";

        }

        return "Early intervention recommended. "
                + student.getName()
                + " is currently showing indicators "
                + "that may require additional support.";
    }
}