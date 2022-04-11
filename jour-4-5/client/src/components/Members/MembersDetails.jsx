import { useParams } from "react-router"
import { useState, useEffect } from "react"
import axios from "axios"
import { useCookies } from "react-cookie";
import "./Members.css"
import { Link } from "react-router-dom"
import uuid from 'react-uuid'

export default function MembersDetails() {
    const { name } = useParams()
    const [tickets, setTickets] = useState([])
    const [error, setError] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [welcome, setWelcome] = useState(cookies.user)

    function handleLogout() {
        removeCookie("user")
    }

    useEffect(() => {
        axios.get("http://localhost:4242/tickets")
            .then(res => setTickets(res.data))
            .catch(err => setError("Error when fetching tickets"))
    }, [])

    const [search, setSearch] = useState("")
    const handleInput = (e) => {
        setSearch(e.target.value)
      }

    return (
        <div>
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
                <input className="input-add form-control" onChange={handleInput} placeholder="Search"/>
                <br/>
                    {tickets.map((ticket) => {
                        if (ticket.title.toLowerCase().indexOf(search.toLowerCase()) === -1 && ticket.body.toLowerCase().indexOf(search.toLowerCase()) === -1) {
                            return
                          }
                        if (ticket.id_user !== cookies.user && ticket.id_user === name) {
                            return (
                                <>
                                    <ul className="list-group list-group-flush">
                                        <li key={uuid()} className="list-group-item">
                                            <Link to={{ pathname: `/${ticket.id_user}/${ticket._id}` }}>
                                                <u>{ticket.title}</u>
                                            </Link>
                                        </li>
                                        <li key={uuid()} className="list-group-item">
                                            {ticket.body}
                                        </li>
                                    </ul>
                                </>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
