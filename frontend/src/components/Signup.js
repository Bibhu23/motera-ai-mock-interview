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
  const handlesubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    Seterror("Passwords do not match");
    return;
  }

  try {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      experienceYears: Number(form.experienceYears),
      skills: form.skills.split(",").map((s) => s.trim()),
      phone: form.phone,
      linkedInUrl: form.linkedInUrl
    };

    console.log("signup payload", payload);

    const response = await Gpi.post("/user/api/v1/register", payload);

    console.log("Response:", response.data);
   

  } catch (err) {
    Seterror(err.response?.data?.message || "Signup failed");
  }


<<<<<<< HEAD
=======
            await Gpi.post("/register", payload)
            // navigate("/login")
        } catch (err) {
            Seterror(err.response?.data?.message || "signup failed")
        }
>>>>>>> main
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
                    <input type="file" className="form-control" required />
                    <small className="text-muted">Resume upload coming soon...</small>
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}
export default Signup