<<<<<<< Updated upstream
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:7656/user/api/v1/profile";

/*export async function uploadResume(file) {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post("http://localhost:7656/api/upload-resume", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data; // backend should return parsed profile
}*/

//save profile here
export async function saveProfile(profile) {
    
   const formData = new FormData();
    formData.append("fullName", profile.fullName);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("title", profile.title);
    formData.append("city", profile.city);
    formData.append("country", profile.country);
    formData.append("experience", profile.experience);
    formData.append("summary", profile.summary);
    formData.append("skills", profile.skills);
    formData.append("hobbies", profile.hobbies);
    formData.append("workHistory", JSON.stringify(profile.workHistory));
    formData.append("education", JSON.stringify(profile.education));
    formData.append("certifications", JSON.stringify(profile.certifications));
    
    // Only append resume if it's a file
    if (profile.resume && profile.resume instanceof File) {
        formData.append("resume", profile.resume);
    }
    
    const res = await axios.post(`${API_URL}/update`, formData, { 
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
    });
    return res.data;
}

export async function getProfile() {
    const res = await axios.get(`${API_URL}/getProfile`, { withCredentials: true });
    return res.data.profile;
=======
import Gpi from "../Gpi";

// Fetch profile
// profileService.js
export async function getProfile() {
    const res = await Gpi.get("/user/api/v1/profile", { withCredentials: true });
    return res.data;
}

// Upload resume and get parsed data
export async function uploadResume(file) {
    try {
        const formData = new FormData();
        formData.append("resume", file);

        const res = await Gpi.post("/api/upload-resume", formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data.parsedData; // parsed resume returned from backend
    } catch (err) {
        console.error("Resume upload failed:", err);
        throw err;
    }
}

// Save / update profile
export async function updateProfile(profileData) {
    try {
        const res = await Gpi.post("/user/api/v1/profile/update", profileData, {
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        console.error("Failed to update profile:", err);
        throw err;
    }
>>>>>>> Stashed changes
}
