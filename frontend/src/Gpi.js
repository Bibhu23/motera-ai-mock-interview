import axios from "axios";

const Gpi = axios.create({
    baseURL: "https://motera-backend.onrender.com",
    withCredentials: true,
});

Gpi.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default Gpi;
