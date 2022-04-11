import React from 'react'
import { Link } from "react-router-dom"
import "./Members.css"
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react"
import axios from "axios";

export default function Members() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [welcome, setWelcome] = useState(cookies.user)
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")

    function handleLogout() {
        removeCookie("user")
    }

    useEffect(() => {
    axios.get("http://localhost:4242/users")
        .then(res => setUsers(res.data))
        .catch(err => setError("Error when fetching tickets"))
    }, [])

    return (
        <div className="homeContainer">
            <Link to="/login">
                <button className="formButtonHome" onClick={handleLogout}>
                    Logout
                </button>
            </Link>
            <Link to={"/" + cookies.user}>
                <button className="formButtonHome">
                    Profil
                </button>
            </Link>
            <div className="home">
                <h2> Welcome to your blog {welcome} !</h2>
                <p>{error}</p>
            </div>
            <div className="tickets">
                <h3> All users: </h3>
                {users.map((user) => {
                    if (user.login !== cookies.user) {
                        return (
                            <>
                                <ul class="list-group list-group-flush">
                                    <li key={user.login} class="list-group-item">
                                        <Link to={{ pathname: `/${user.login}` }}>
                                            <u>{user.login}</u>
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        )
                    }
                })}
            </div>
        </div>
    )
}
