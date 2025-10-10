import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
// import DashboardNavbar from "./DashboardNavbar";
import ProgressBar from "../components/ProgressBar";
import { AppContext } from "../context/Appcontext";
import { uploadResume, saveProfile, getProfile } from "../services/profileService";
import "./ProfilePage.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ProfilePage = () => {

    const { login } = useContext(AppContext);
    const navigate = useNavigate();
    //also upload resume here

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

    });

    const [completion, setCompletion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Calculate profile completion 
    useEffect(() => {
        const fields = Object.values(profile);
        const filled = fields.filter(v => {
            if (Array.isArray(v)) return v.length > 0;   // arrays
            //trim only the String
            if (typeof v === "string") return v.trim() !== ""; // strings
            return v != null; // other values (like numbers)
        });
        setCompletion(Math.round((filled.length / fields.length) * 100));
    }, [profile]);

    // Fetch profile on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getProfile();
                if (data) {
                    console.log(data);

                    setProfile(data);
                }
            } catch (err) {
                //for the first time it will execute
                if (err.response && err.response.status === 404) {
                    // First-time user, show empty form
                    setProfile({
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
                    });
                } else {
                    console.log(err);

                }
            }

        }
        fetchData();
    }, []);

    // Handle resume upload
    const handleFileUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        /*setLoading(true);
        setMessage("Analyzing your resume...");
        try {
            const data = await uploadResume(uploadedFile);
            setProfile(prev => ({ ...prev, ...data }));
            setMessage("Resume analyzed successfully!");
        } catch (err) {
            setMessage("Failed to analyze resume. Try again.");
        } finally {
            setLoading(false);
        }*/
        setProfile({ ...profile, resume: e.target.files[0] })
    };
    //handle certification upload
    const handleCertificationUpload = (e) => {
        setProfile({ ...profile, certifications: e.target.files[0] })
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    // Add item to array fields
    const handleAddItem = (field) => {
        setProfile(prev => ({
            ...prev,
            [field]: [...prev[field], ""]
        }));
    };
    // Remove item from array fields
    const handleRemoveItem = (field, index) => {
        setProfile(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Handle array item change
    const handleArrayChange = (field, index, value) => {
        const updated = [...profile[field]];
        updated[index] = value;
        setProfile(prev => ({ ...prev, [field]: updated }));
    };

    // Save profile
    const handleSave = async () => {
        try {
            setLoading(true);
            await saveProfile(profile);
            setMessage("Profile saved successfully!");
            navigate("/profile/view")
        } catch (err) {
            setMessage("Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">

            <Sidebar />

            <div className="main">

                {/* <DashboardNavbar user={{ name: "Bibhu", avatar: "" }} /> */}

                {/* Header */}
                <div className="profile-header">
                    <h2>Complete Your Profile</h2>
                    <p className="text-muted">
                        A complete profile helps our AI understand you better.
                    </p>
                </div>

                {/* Upload Section */}
                <div className="upload-box">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        id="resumeUpload"
                        style={{ display: "none" }}
                    />
                    <label htmlFor="resumeUpload" className="upload-label">
                        {loading ? "Processing..." : "Click to upload or drag and drop your resume"}
                        <br />
                        <small>PDF or DOCX (MAX. 5MB)</small>
                    </label>
                </div>

                {/* Progress Bar */}
                <ProgressBar percentage={completion} />

                {/* Profile Details Box */}
                <div className="profile-details-box">

                    <h4>Your Profile Details</h4>
                    {/* Horizontal Rows for main fields */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Professional Title</label>
                            <input
                                name="title"
                                value={profile.title}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input
                                name="city"
                                value={profile.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input
                                name="country"
                                value={profile.country}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input
                                name="experience"
                                value={profile.experience}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Vertical long text fields */}
                    <div className="form-group">
                        <label>Professional Summary</label>
                        <textarea
                            name="summary"
                            rows={3}
                            value={profile.summary}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <textarea
                            name="skills"
                            rows={2}
                            value={profile.skills}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Hobbies & Interests</label>
                        <textarea
                            name="hobbies"
                            rows={2}
                            value={profile.hobbies}
                            onChange={handleChange}
                        />
                    </div>


                    {/* Work History */}
                    <div className="array-group">
                        <h5>Work History</h5>

                        {profile.workHistory.map((item, idx) => (
                            <div className="array-item" key={idx}>
                                {/* Remove button for each entry */}
                                <button className="remove-btn" onClick={() => handleRemoveItem("workHistory", idx)}>
                                    <FaMinus />
                                </button>

                                {/* Row 1: Job Title | Company */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Job Title</label>
                                        <input
                                            value={item.jobTitle || ""}
                                            onChange={(e) => handleArrayChange("workHistory", idx, { ...item, jobTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Company</label>
                                        <input
                                            value={item.company || ""}
                                            onChange={(e) => handleArrayChange("workHistory", idx, { ...item, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Start Date | End Date */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="month"
                                            value={item.startDate || ""}
                                            onChange={(e) => handleArrayChange("workHistory", idx, { ...item, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="month"
                                            value={item.endDate || ""}
                                            onChange={(e) => handleArrayChange("workHistory", idx, { ...item, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Description */}
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        rows={2}
                                        value={item.description || ""}
                                        onChange={(e) => handleArrayChange("workHistory", idx, { ...item, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Single Add button at bottom */}
                        <button className="add-btn" onClick={() => handleAddItem("workHistory")}>
                            <FaPlus /> Add Work History
                        </button>
                    </div>


                    {/* Education Section */}
                    <div className="array-group">
                        <h5>Education</h5>

                        {profile.education.map((item, idx) => (
                            <div className="array-item" key={idx}>
                                {/* Remove button for each entry */}
                                <button className="remove-btn" onClick={() => handleRemoveItem("education", idx)}>
                                    <FaMinus />
                                </button>

                                {/* Row 1: Institution Name | Degree */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Institution Name</label>
                                        <input
                                            value={item.institution || ""}
                                            onChange={(e) => handleArrayChange("education", idx, { ...item, institution: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Degree</label>
                                        <input
                                            value={item.degree || ""}
                                            onChange={(e) => handleArrayChange("education", idx, { ...item, degree: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Field of Study | Graduation Year */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Field of Study</label>
                                        <input
                                            value={item.fieldOfStudy || ""}
                                            onChange={(e) => handleArrayChange("education", idx, { ...item, fieldOfStudy: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Graduation Year</label>
                                        <input
                                            type="number"
                                            value={item.graduationYear || ""}
                                            onChange={(e) => handleArrayChange("education", idx, { ...item, graduationYear: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Row 3: CGPA */}
                                <div className="form-group">
                                    <label>CGPA</label>
                                    <input
                                        value={item.cgpa || ""}
                                        onChange={(e) => handleArrayChange("education", idx, { ...item, cgpa: e.target.value })}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Single Add button at bottom */}
                        <button className="add-btn" onClick={() => handleAddItem("education")}>
                            <FaPlus /> Add Education
                        </button>
                    </div>
                    {/* add Certifications */}
                    <div className="array-group">
                        <h5>Certifications</h5>

                        {profile.certifications.map((item, idx) => (
                            <div className="array-item" key={idx}>
                                {/* Show remove button for each entry */}
                                <button className="remove-btn" onClick={() => handleRemoveItem("certifications", idx)}>
                                    <FaMinus />
                                </button>

                                {/* Certification Name | Organization */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Certification Name</label>
                                        <input
                                            value={item.name || ""}
                                            onChange={(e) => handleArrayChange("certifications", idx, { ...item, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Issuing Organization</label>
                                        <input
                                            value={item.organization || ""}
                                            onChange={(e) => handleArrayChange("certifications", idx, { ...item, organization: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Date Obtained */}
                                <div className="form-group">
                                    <label>Date Obtained</label>
                                    <input
                                        type="date"
                                        value={item.dateObtained || ""}
                                        onChange={(e) => handleArrayChange("certifications", idx, { ...item, dateObtained: e.target.value })}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Single Add button at bottom */}
                        <button className="add-btn" onClick={() => handleAddItem("certifications")}>
                            <FaPlus /> Add Certification
                        </button>
                    </div>

                    <button onClick={handleSave} disabled={loading} className="btn-save">
                        {loading ? "Saving..." : "Save Profile"}
                    </button>

                    {message && <p className="message">{message}</p>}

                </div>

            </div>

        </div>
    );
};

export default ProfilePage;