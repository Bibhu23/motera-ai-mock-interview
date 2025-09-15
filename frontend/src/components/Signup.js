// npm install axios react-router-dom bootstrap

import { useState } from "react"
import Gpi from "../Gpi"
import { useNavigate } from "react-router"

function Signup() {
    const [form, Setform] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        experienceYears: "",
        skills: "",
        phone: "",
        linkedInUrl: ""
    })
    const [error, Seterror] = useState("")
    const navigate = useNavigate()

    const handlechnage = (event) => {
        Setform({ ...form, [event.target.name]: event.target.value })
   
    }
     const handleResume = (e) => {
  Setform({ ...form, resume: e.target.files[0] });
};
  const handlesubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    Seterror("Passwords do not match");
    return;
  }

  try {
    //fromdata is req for handling file upload
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);
    formData.append("experienceYears", form.experienceYears);
    formData.append("skills", form.skills);
    formData.append("phone", form.phone);
    formData.append("linkedInUrl", form.linkedInUrl);

     if(form.resume){
    formData.append("resume", form.resume);
     }

    const response = await Gpi.post("/user/api/v1/register", formData,{
        headers:{"Content-Type":"multipart/form-data"}
    });

    console.log("Response:", response.data);
   

  } catch (err) {
    Seterror(err.response?.data?.message || "Signup failed");
  }
  


    }
    return (
        <div className="container mt-5">
            {error && <div className="alert alert-danger">{error}</div>}
            <h2>Signup</h2>
            <form onSubmit={handlesubmit} className="col-md-8">
                <div className="mb-3">
                    <label>Full Name</label>
                    <input type="text" name="name" className="form-control" value={form.name} onChange={handlechnage} required />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" value={form.email} onChange={handlechnage} required />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" value={form.password} onChange={handlechnage} required />
                </div>
                <div className="mb-3">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handlechnage} required />
                </div>
                <div className="mb-3">
                    <label>Role /Job Title</label>
                    <select name="role" className="form-select" value={form.role} onChange={handlechnage} required>
                        <option value="">Select Role</option>
                        <option value="React Developer">React Developer</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Fullstack Developer">Fullstack Developer</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>year of Experience</label>
                    <input type="number" name="experienceYears" className="form-control" value={form.experienceYears} min="0" onChange={handlechnage} required />
                </div>
                <div className="mb-3">
                    <label>Skills (comma separated)</label>
                    <input type="text" name="skills" className="form-control"
                        placeholder="e.g. React, Node.js, SQL"
                        value={form.skills} onChange={handlechnage} />
                </div>

                <div className="mb-3">
                    <label>Phone Number</label>
                    <input type="text" name="phone" className="form-control"
                        value={form.phone} onChange={handlechnage} />
                </div>
                <div className="mb-3">
                    <label>LinkedIn Profile</label>
                    <input type="url" name="linkedInUrl" className="form-control"
                        value={form.linkedInUrl} onChange={handlechnage} />
                </div>
                <div className="mb-3">
                    <label>upload Resume</label>
                    <input type="file"  name="resume"    className="form-control" onChange={handleResume} required />
                    <small className="text-muted">Resume upload coming soon...</small>
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}
export default Signup