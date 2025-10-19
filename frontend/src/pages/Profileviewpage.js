import React, { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import "./ProfileViewPage.css";
import dummyAvatar from "../assets/Avtar.webp"; // dummy symbol
import { useNavigate } from "react-router-dom";

const ProfileViewPage = () => {
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);
 const navigate=useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProfile();
        setProfile(data);

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
const Edit=()=>{
 navigate("/profile");
}
  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      {/* LEFT SECTION: IMAGE + WORK + SKILLS */}
      <div className="profile-left">
        <img
          src={profile.photo || dummyAvatar}
          alt="Profile"
          className="profile-photo"
        />

        <div className="work-section">
          <h3>Work</h3>
          {profile.workHistory?.slice(0, 2).map((work, idx) => (
            <div key={idx} className="work-item">
              <strong>{work.company}</strong>
              <p>{work.jobTitle}</p>
            </div>
          ))}
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          <ul>
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, i) => <li key={i}>{skill}</li>)
            ) : (
              <p>No skills listed</p>
            )}
          </ul>
        </div>
      </div>

      {/* RIGHT SECTION: MAIN PROFILE INFO */}
      <div className="profile-right-wrapper">
      <div className="profile-right">
        <h2>{profile.fullName}</h2>
        <p className="title">{profile.title}</p>
        <p className="location">
          {profile.city}, {profile.country}
        </p>

        <div className="rating">⭐ {profile.rating || "8.6"} / 10</div>

        <div className="contact-info">
          <p>
            <strong>📞 Phone:</strong> {profile.phone}
          </p>
          <p>
            <strong>📧 Email:</strong> {profile.email}
          </p>
        </div>

        <div className="summary">
          <h3>About</h3>
          <p>{profile.summary || "No summary available."}</p>
        </div>
        
      </div>
      <div className="edit-button-container">
        <button onClick={Edit}>Edit</button>
      </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;
