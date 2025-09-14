import axios from "axios";

//baseurl for backend
const Gpi = axios.create({
    baseURL: "http:localhost:5000/api"
})

Gpi.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export default Gpi;