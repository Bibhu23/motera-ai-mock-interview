import React, { useEffect, useState, useContext, useRef } from "react";
import { getProfile } from "../services/profileService";
import "./ProfileViewPage.css";
import dummyAvatar from "../assets/Avtar.webp";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Wrapper for sections
const ProfileSection = ({ title, children }) => (
  <div className="profile-section">
    <h3>{title}</h3>
    {children}
  </div>
);

// Work History component
const WorkHistory = ({ workHistory = [] }) => (
  <ProfileSection title="Work History">
    {workHistory.length > 0 ? (
      workHistory.map((work, idx) => (
        <div key={idx} className="work-item fade-in">
          <strong>{work.company || "Company not specified"}</strong>
          <p>{work.jobTitle || "Job title not specified"}</p>
          <p>{work.startDate || "Start Date"} - {work.endDate || "Present"}</p>
        </div>
      ))
    ) : (
      <p className="no-data">No work history available</p>
    )}
  </ProfileSection>
);

// Skills component
const SkillsList = ({ skills = [] }) => {
  let skillArray = [];
  if (Array.isArray(skills)) skillArray = skills;
  else if (typeof skills === "string") {
    skillArray = skills.split(",").map(s => s.trim()).filter(Boolean);
  }
  return (
    <ProfileSection title="Skills">
      {skillArray.length > 0 ? (
        <ul className="skills-list">
          {skillArray.map((skill, i) => (
            <li key={i} className="skill-tag fade-in">{skill}</li>
          ))}
        </ul>
      ) : (
        <p className="no-data">No skills listed</p>
      )}
    </ProfileSection>
  );
};

// Job Suggestions with horizontal scroll
const JobSuggestions = ({ jobs = [] }) => {
  const scrollContainerRef = useRef(null);
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -350 : 350,
        behavior: 'smooth'
      });
    }
  };

  return (
    <ProfileSection title="Job Suggestions">
      {jobs.length > 0 ? (
        <div className="job-list-container">
          <button className="scroll-button left" onClick={() => scroll('left')} aria-label="Scroll left">
            <FaChevronLeft />
          </button>

          <ul className="job-list" ref={scrollContainerRef}>
            {jobs.map((job, idx) => (
              <li key={job.id || idx} className="fade-in">
                <h4 className="job-card-title">{job.title || "No Title"}</h4>
                <div className="job-card-company">{job.company?.display_name || "Unknown Company"}</div>
                <div className="job-card-location">{job.location?.display_name || "Location not specified"}</div>
                <div className="job-tags-container">
                  {job.category?.label && <div className="job-category">{job.category.label}</div>}
                  {job.contract_type && <div className="job-type">{job.contract_type}</div>}
                </div>
                <a href={job.redirect_url || "#"} target="_blank" rel="noopener noreferrer" className="job-card-link">
                  View Job
                </a>
              </li>
            ))}
          </ul>

          <button className="scroll-button right" onClick={() => scroll('right')} aria-label="Scroll right">
            <FaChevronRight />
          </button>
        </div>
      ) : (
        <p className="no-data">No job suggestions available</p>
      )}
    </ProfileSection>
  );
};

// Main ProfileViewPage
const ProfileViewPage = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    title: "",
    city: "",
    country: "",
    experience: "",
    summary: "",
    skills: "",
    hobbies: "",
    workHistory: [],
    education: [],
    certifications: [],
    preferredLocations: [],
    photo: null
  });

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { backend } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch profile
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const data = await getProfile();
        console.log("Fetched profile:", data);
        if (data) setProfile(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      if (!profile.skills || (!profile.city && !profile.country)) return;

      try {
        setJobsLoading(true);
        const skillsArray = typeof profile.skills === "string"
          ? profile.skills.split(",").map(s => s.trim()).filter(Boolean)
          : profile.skills;

        const locations = [profile.city, profile.country].filter(Boolean);
        const allJobs = [];

        for (const skill of skillsArray.slice(0, 3)) {
          for (const location of locations) {
            try {
              const res = await fetch(`${backend}/api/jobs?skill=${encodeURIComponent(skill)}&location=${encodeURIComponent(location)}`);
              const data = await res.json();
              if (Array.isArray(data)) allJobs.push(...data);
            } catch (err) {
              console.error("Jobs fetch error:", err);
            }
          }
        }

        // Deduplicate jobs
        const uniqueJobs = Array.from(new Set(allJobs.map(j => JSON.stringify(j)))).map(s => JSON.parse(s));
        setJobs(uniqueJobs.slice(0, 10));
      } finally {
        setJobsLoading(false);
      }
    }
    fetchJobs();
  }, [profile, backend]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-page-wrapper">
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
              <h2>{profile.fullName || "No Name"}</h2>
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
