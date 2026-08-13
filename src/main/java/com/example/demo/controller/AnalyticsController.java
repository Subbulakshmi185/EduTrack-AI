package com.example.demo.controller;

import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getStudentAnalytics(
            @PathVariable Integer id) {

        Map<String, Object> analytics =
                studentService.getStudentAnalytics(id);

        return ResponseEntity.ok(analytics);
    }
}