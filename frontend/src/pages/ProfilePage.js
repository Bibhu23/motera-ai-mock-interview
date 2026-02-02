import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../pages/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { AppContext } from "../context/Appcontext";
import { saveProfile, getProfile } from "../services/profileService";
import "./ProfilePage.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ProfilePage = () => {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();

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
        resume: null,
        certifications: [],
        preferredLocations: [],
    });

    const [completion, setCompletion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Calculate profile completion
    useEffect(() => {
        const fields = Object.values(profile);
        const filled = fields.filter((v) => {
            if (Array.isArray(v)) return v.length > 0;
            if (typeof v === "string") return v.trim() !== "";
            return v != null;
        });
        setCompletion(Math.round((filled.length / fields.length) * 100));
    }, [profile]);

    // Fetch profile on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProfile();
                if (data?.profile) {
                    setProfile({
                        ...data.profile,
                        workHistory: data.profile.workHistory || [],
                        education: data.profile.education || [],
                        certifications: data.profile.certifications || [],
                        preferredLocations: data.profile.preferredLocations || [],
                        // resume is a file path string from backend
                    });
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setProfile((prev) => ({ ...prev }));
                } else {
                    console.error("Error fetching profile:", err);
                }
            }
        };
        fetchData();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file upload
    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        if (field === "resume") {
            setProfile((prev) => ({ ...prev, resume: file }));
        } else if (field === "certifications") {
            setProfile((prev) => ({
                ...prev,
                certifications: [...prev.certifications, file],
            }));
        }
    };

    // Add/Remove items for arrays
    const handleAddItem = (field) => {
        const newItem = field === "workHistory"
            ? { jobTitle: "", company: "", startDate: "", endDate: "", description: "" }
            : field === "education"
                ? { institution: "", degree: "", fieldOfStudy: "", graduationYear: "", cgpa: "" }
                : { name: "", organization: "", dateObtained: "" };

        setProfile((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
    };

    const handleRemoveItem = (field, index) => {
        setProfile((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...profile[field]];
        updated[index] = value;
        setProfile((prev) => ({ ...prev, [field]: updated }));
    };

    // Handle preferred locations
    const handleLocationKeydown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = e.target.value.trim();
            if (
                value &&
                !profile.preferredLocations.includes(value) &&
                profile.preferredLocations.length < 3
            ) {
                setProfile((prev) => ({
                    ...prev,
                    preferredLocations: [...prev.preferredLocations, value],
                }));
                e.target.value = "";
            }
        }
    };

    const handleRemoveLocation = (idx) => {
        setProfile((prev) => ({
            ...prev,
            preferredLocations: prev.preferredLocations.filter((_, i) => i !== idx),
        }));
    };

    // Save profile with FormData
    const handleSave = async () => {
        try {
            setLoading(true);
            const formData = new FormData();

            Object.keys(profile).forEach((key) => {
                if (key === "resume" && profile.resume) {
                    formData.append("resume", profile.resume);
                } else if (["workHistory", "education", "certifications"].includes(key)) {
                    formData.append(key, JSON.stringify(profile[key]));
                } else if (Array.isArray(profile[key])) {
                    formData.append(key, JSON.stringify(profile[key]));
                } else {
                    formData.append(key, profile[key] || "");
                }
            });

            await saveProfile(formData); // send FormData

            setMessage("Profile saved successfully!");
            setTimeout(() => navigate("/profile/view"), 1000);
        } catch (err) {
            console.error("Save profile error:", err);
            setMessage("Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <Sidebar />
            <div className="main">
                <Link to="/" className="back-home">
                    <FaArrowLeft /> Back to Home
                </Link>

                <div className="profile-header">
                    <h2>Complete Your Profile</h2>
                    <p className="text-muted">A complete profile helps our AI understand you better.</p>
                </div>

                <div className="upload-box">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        id="resumeUpload"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, "resume")}
                    />
                    <label htmlFor="resumeUpload" className="upload-label">
                        {profile.resume?.name ? `File selected: ${profile.resume.name}` : "Click to upload or drag and drop your resume"}
                        <br />
                        <small>PDF or DOCX (MAX. 5MB)</small>
                    </label>
                </div>

                <ProgressBar percentage={completion} />

                <div className="profile-details-box">
                    {/* Main Profile Fields */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="fullName" value={profile.fullName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" value={profile.email} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone</label>
                            <input name="phone" value={profile.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Professional Title</label>
                            <input name="title" value={profile.title} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input name="city" value={profile.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input name="country" value={profile.country} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input type="number" name="experience" value={profile.experience} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Professional Summary</label>
                        <textarea rows={3} name="summary" value={profile.summary} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <textarea rows={2} name="skills" value={profile.skills} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Preferred Job Locations (max 3)</label>
                        <input type="text" placeholder="Type location and press Enter" onKeyDown={handleLocationKeydown} />
                        <div className="selected-locations">
                            {profile.preferredLocations.map((loc, idx) => (
                                <span key={idx} className="location-tag">
                                    {loc} <button onClick={() => handleRemoveLocation(idx)}>x</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Hobbies & Interests</label>
                        <textarea rows={2} name="hobbies" value={profile.hobbies} onChange={handleChange} />
                    </div>

                    {/* Work History */}
                    <ArrayField field="workHistory" profile={profile} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleArrayChange={handleArrayChange} />

                    {/* Education */}
                    <ArrayField field="education" profile={profile} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleArrayChange={handleArrayChange} />

                    {/* Certifications */}
                    <ArrayField field="certifications" profile={profile} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleArrayChange={handleArrayChange} />

                    <button type="button" onClick={handleSave} disabled={loading} className="btn-save">
                        {loading ? "Saving..." : "Save Profile"}
                    </button>

                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

// Helper component for arrays (workHistory, education, certifications)
const ArrayField = ({ field, profile, handleAddItem, handleRemoveItem, handleArrayChange }) => {
    return (
        <div className="array-group">
            <h5>{field.charAt(0).toUpperCase() + field.slice(1)}</h5>
            {profile[field].map((item, idx) => (
                <div className="array-item" key={idx}>
                    <button type="button" className="remove-btn" onClick={() => handleRemoveItem(field, idx)}>
                        <FaMinus />
                    </button>

                    {Object.keys(item).map((key) => (
                        <div className="form-group" key={key}>
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                                value={item[key] || ""}
                                onChange={(e) => handleArrayChange(field, idx, { ...item, [key]: e.target.value })}
                            />
                        </div>
                    ))}
                </div>
            ))}

            <button type="button" className="add-btn" onClick={() => handleAddItem(field)}>
                <FaPlus /> Add {field}
            </button>
        </div>
    );
};
