import axios from "axios";

const Gpi = axios.create({
    baseURL: "http://localhost:7656",
    withCredentials: true,
});

Gpi.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default Gpi;
