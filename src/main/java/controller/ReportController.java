package com.example.citizenreporter.controller;

import com.example.citizenreporter.model.Report;
import com.example.citizenreporter.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}) // ✅ allow frontend (running in VS Code) to call API
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    // ✅ Create new report (POST)
    @PostMapping
    public Report createReport(@RequestBody Report report) {
        return reportRepository.save(report);
    }

    // ✅ Get all reports (GET)
    @GetMapping
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}
