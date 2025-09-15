import axios from "axios";

//baseurl for backend
const Gpi = axios.create({
<<<<<<< HEAD
    baseURL: "http://localhost:7656", 
    withCredentials: true,            
});
=======
    baseURL: "http://localhost:7656/api", // backend base URL
})
>>>>>>> main

Gpi.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export default Gpi;