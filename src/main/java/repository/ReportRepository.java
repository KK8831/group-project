package com.example.citizenreporter.repository;

import com.example.citizenreporter.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // 🔍 Find all reports submitted by a specific user
    List<Report> findByUser(String user);

    // 🔍 Optional: Find reports by issue type
    List<Report> findByIssue(String issue);
}
