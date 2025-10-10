import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { getProfile } from "../services/profileService";
import "./ProfilePage.css"; // reuse same styling

const ProfileViewPage = () => {
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProfile();
        setProfile(data);

        // Calculate completion
        const fields = Object.values(data);
        const filled = fields.filter((v) => {
          if (Array.isArray(v)) return v.length > 0;
          if (typeof v === "string") return v.trim() !== "";
          return v != null;
        });
        setCompletion(Math.round((filled.length / fields.length) * 100));
      } catch (err) {
        console.log("Error loading profile:", err);
      }
    }
    fetchData();
  }, []);

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      

      <div className="main">
        <div className="profile-header">
          <h2>{profile.fullName || "User Profile"}</h2>
          <p className="text-muted">Your personal and professional overview</p>
        </div>

        {/* Resume Section */}
        <div className="upload-box view-mode">
          {profile.resume ? (
            <a
              href={profile.resume.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-link"
            >
              📄 View Uploaded Resume
            </a>
          ) : (
            <p>No resume uploaded</p>
          )}
        </div>

        {/* Progress */}
        <ProgressBar percentage={completion} />

        {/* Profile Info */}
        <div className="profile-details-box view-only">
          <h4>Personal Details</h4>
          <div className="info-grid">
            <p><strong>Full Name:</strong> {profile.fullName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Title:</strong> {profile.title}</p>
            <p><strong>City:</strong> {profile.city}</p>
            <p><strong>Country:</strong> {profile.country}</p>
            <p><strong>Experience:</strong> {profile.experience} years</p>
          </div>

          <div className="long-section">
            <h5>Professional Summary</h5>
            <p>{profile.summary || "No summary provided."}</p>
          </div>

          <div className="long-section">
            <h5>Skills</h5>
            <p>{profile.skills || "No skills added."}</p>
          </div>

          <div className="long-section">
            <h5>Hobbies</h5>
            <p>{profile.hobbies || "No hobbies listed."}</p>
          </div>

          {/* Work History */}
          <div className="array-group">
            <h5>Work History</h5>
            {profile.workHistory?.length > 0 ? (
              profile.workHistory.map((item, idx) => (
                <div key={idx} className="array-item view-item">
                  <p><strong>Job Title:</strong> {item.jobTitle}</p>
                  <p><strong>Company:</strong> {item.company}</p>
                  <p><strong>Period:</strong> {item.startDate} – {item.endDate || "Present"}</p>
                  <p><strong>Description:</strong> {item.description}</p>
                </div>
              ))
            ) : (
              <p>No work history added.</p>
            )}
          </div>

          {/* Education */}
          <div className="array-group">
            <h5>Education</h5>
            {profile.education?.length > 0 ? (
              profile.education.map((item, idx) => (
                <div key={idx} className="array-item view-item">
                  <p><strong>Institution:</strong> {item.institution}</p>
                  <p><strong>Degree:</strong> {item.degree}</p>
                  <p><strong>Field:</strong> {item.fieldOfStudy}</p>
                  <p><strong>Graduation Year:</strong> {item.graduationYear}</p>
                  <p><strong>CGPA:</strong> {item.cgpa}</p>
                </div>
              ))
            ) : (
              <p>No education added.</p>
            )}
          </div>

          {/* Certifications */}
          <div className="array-group">
            <h5>Certifications</h5>
            {profile.certifications?.length > 0 ? (
              profile.certifications.map((item, idx) => (
                <div key={idx} className="array-item view-item">
                  <p><strong>Certification:</strong> {item.name}</p>
                  <p><strong>Organization:</strong> {item.organization}</p>
                  <p><strong>Date Obtained:</strong> {item.dateObtained}</p>
                </div>
              ))
            ) : (
              <p>No certifications added.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;
