import React, { useEffect, useState, useContext, useRef } from "react";
import { getProfile } from "../services/profileService";
import "./ProfileViewPage.css";
import dummyAvatar from "../assets/Avtar.webp";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Section wrapper
const ProfileSection = ({ title, children }) => (
  <div className="profile-section">
    <h3>{title}</h3>
    {children}
  </div>
);

// Work History component remains the same
const WorkHistory = ({ workHistory = [] }) => (
  <ProfileSection title="Work History">
    {workHistory.length > 0 ? (
      workHistory.map((work, idx) => (
        <div key={idx} className="work-item fade-in">
          <strong>{work.company}</strong>
          <p>{work.jobTitle}</p>
          <p>
            {work.startDate} - {work.endDate || "Present"}
          </p>
        </div>
      ))
    ) : (
      <p className="no-data">No work history available</p>
    )}
  </ProfileSection>
);

// Skills List component remains the same
const SkillsList = ({ skills = [] }) => {
  let skillArray = [];

  if (Array.isArray(skills)) skillArray = skills;
  else if (typeof skills === "string") {
    skillArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
  }

  return (
    <ProfileSection title="Skills">
      {skillArray.length > 0 ? (
        <ul className="skills-list">
          {skillArray.map((skill, i) => (
            <li key={i} className="skill-tag fade-in">
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data">No skills listed</p>
      )}
    </ProfileSection>
  );
};

// Updated Job Suggestions component with horizontal scroll
const JobSuggestions = ({ jobs = [] }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 350;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <ProfileSection title="Job Suggestions">
      {jobs.length > 0 ? (
        <div className="job-list-container">
          <button
            className="scroll-button left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          <ul className="job-list" ref={scrollContainerRef}>
            {jobs.map((job, idx) => (
              <li key={job.id || idx} className="fade-in">
                <h4 className="job-card-title">{job.title}</h4>
                <div className="job-card-company">
                  {job.company?.display_name || "Unknown Company"}
                </div>
                <div className="job-card-location">
                  {job.location?.display_name || "Location not specified"}
                </div>
                {job.category?.label && (
                  <div className="job-category">{job.category.label}</div>
                )}
                {job.contract_type && (
                  <div className="job-type">{job.contract_type}</div>
                )}
                <a
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="job-card-link"
                >
                  View Job
                </a>
              </li>
            ))}
          </ul>

          <button
            className="scroll-button right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      ) : (
        <p className="no-data">No job suggestions available</p>
      )}
    </ProfileSection>
  );
};

// Main ProfileViewPage component
const ProfileViewPage = () => {
  // States remain the same
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { backend } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch profile effect remains the same
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  // Fetch jobs effect remains the same
  useEffect(() => {
    async function fetchJobsForProfile() {
      if (!profile || !profile.skills?.length || (!profile.city && !profile.country))
        return;

      try {
        setJobsLoading(true);
        const skillsArray = Array.isArray(profile.skills) ? profile.skills : [];
        const locations = [profile.city, profile.country].filter(Boolean);
        const allJobs = [];

        for (const skill of skillsArray) {
          for (const location of locations) {
            const res = await fetch(
              `${backend}/api/jobs?skill=${encodeURIComponent(skill)}&location=${encodeURIComponent(location)}`
            );
            const data = await res.json();
            if (Array.isArray(data)) allJobs.push(...data);
          }
        }
        setJobs(allJobs);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    }
    fetchJobsForProfile();
  }, [profile, backend]);

  // Loading and error states remain the same
  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="no-profile">Profile not found</div>;
  return (
    <div className="profile-page-wrapper"> {/* NEW outer wrapper */}
      <div className="profile-inner-container animate-in">
        <div className="profile-left">
          <div className="profile-photo-container">
            <img
              src={profile.photo || dummyAvatar}
              alt={`${profile.fullName}'s profile`}
              className="profile-photo"
              onError={(e) => (e.target.src = dummyAvatar)}
            />
          </div>
          <WorkHistory workHistory={profile.workHistory} />
          <SkillsList skills={profile.skills} />
        </div>

        <div className="profile-right-wrapper">
          <div className="profile-right">
            <header className="profile-header">
              <h2>{profile.fullName}</h2>
              <p className="title">{profile.title || "No title specified"}</p>
              <p className="location">
                {profile.city && profile.country
                  ? `${profile.city}, ${profile.country}`
                  : "Location not specified"}
              </p>
            </header>

            <div className="contact-info">
              {profile.phone && <p>📞 {profile.phone}</p>}
              {profile.email && <p>📧 {profile.email}</p>}
            </div>

            <div className="summary">
              <h3>About</h3>
              <p>{profile.summary || "No summary available."}</p>
            </div>

            {jobsLoading ? (
              <p className="loading-jobs">Loading job suggestions...</p>
            ) : (
              <JobSuggestions jobs={jobs} />
            )}
          </div>

          <div className="edit-button-container">
            <button onClick={() => navigate("/profile")} className="edit-button">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;