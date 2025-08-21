package com.example.citizenreporter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String user;
    private String issue;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Double lat;
    private Double lng;

    private String address;

    @Column(name = "photo_name")
    private String photoName;

    @Column(name = "captured_photo")
    private String capturedPhoto;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getIssue() { return issue; }
    public void setIssue(String issue) { this.issue = issue; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhotoName() { return photoName; }
    public void setPhotoName(String photoName) { this.photoName = photoName; }

    public String getCapturedPhoto() { return capturedPhoto; }
    public void setCapturedPhoto(String capturedPhoto) { this.capturedPhoto = capturedPhoto; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // --- Debugging & Logging ---
    @Override
    public String toString() {
        return "Report{" +
                "user='" + user + '\'' +
                ", issue='" + issue + '\'' +
                ", notes='" + notes + '\'' +
                ", lat=" + lat +
                ", lng=" + lng +
                ", address='" + address + '\'' +
                ", photoName='" + photoName + '\'' +
                ", capturedPhoto='" + capturedPhoto + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
