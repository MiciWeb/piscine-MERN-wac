import { useState, useEffect } from "react"
import "./Login.css"
import { useCookies } from "react-cookie";
import { Redirect } from 'react-router-dom';
import axios from "axios";

export default function Login() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const onLoginChange = e => setLogin(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value)

    const handleSubmit = e => {
        e.preventDefault();

        const data = { login, password };

        axios.post("http://localhost:4242/login", JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
            .then(res => setCookie("user", res.data, { path: "/" }))
            .catch(err => setError("Password and login dont match !"))

    };

    if (Object.entries(cookies).length === 0) {
    } else {
        return <Redirect to={{ pathname: `/${cookies.user}`}} />
    }
    return (
        <div className="loginContainer">
            <div className="login">
                <h1>
                    Blog Login
            </h1>
                <form action="/register" method="POST">
                    <input type="text" autoComplete="on" value={login} onChange={onLoginChange} className="formStyleLogin" placeholder="Login" required />
                    <input type="password" autoComplete="off" value={password} onChange={onPasswordChange} className="formStyleLogin" placeholder="Password" required />
                    <input type="submit" onClick={handleSubmit} value="Login" className="formButtonLogin" />
                </form>
                <div className="error">{error}</div>
                <a href="/Register">Subscribe</a>
            </div>
        </div>
    )
}
