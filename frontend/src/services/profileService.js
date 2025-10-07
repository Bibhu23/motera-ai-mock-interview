import axios from "axios";

const API_URL = "http://localhost:7656/user/api/v1";

export async function uploadResume(file) {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(`${API_URL}/upload-resume`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data; // backend should return parsed profile
}

export async function saveProfile(profile) {
    const res = await axios.post(`${API_URL}/profile/update`, profile, { // ✅ was /save
        withCredentials: true,
    });
    return res.data;
}

export async function getProfile() {
    const res = await axios.get(`${API_URL}/profile/get`, { withCredentials: true });
    return res.data.profile;
}
