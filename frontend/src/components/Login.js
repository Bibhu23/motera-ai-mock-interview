import React from 'react'
import Gpi from '../Gpi';
import { useContext } from 'react';
import { AppContext } from '../context/Appcontext';
export default function Login() {
    const { user, setUser } = useContext(AppContext);
    const [loginForm, setLoginForm] = React.useState({
        email: '',
        password: ''
    })

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loginForm.email === '' || loginForm.password === '') {
            alert("Please fill all the fields");
            return;
        }
        try {
            const res = await Gpi.post('/user/api/v1/login', loginForm,
                { withCredentials: true }
            );


            if (res.data && res.data.user) {
                setUser(res.data.user);
            }
            console.log("Login successful", res.data);
            alert("Login successful");
        } catch (err) {
            alert("Login failed: " + err.response?.data?.message || err.message);
        }

    }
    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>

                <input type='email' name='email'
                    placeholder='Email'
                    value={loginForm.email}
                    onChange={handleLoginChange} required />
                <input type='password' name='password'
                    placeholder='Password'
                    value={loginForm.password}
                    onChange={handleLoginChange} required />
                <button type='submit'>Login</button>

            </form>
        </div>
    )
}
