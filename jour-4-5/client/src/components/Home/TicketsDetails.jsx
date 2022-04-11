import React from 'react'
import { Link } from "react-router-dom"
import "./Home.css"
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react"
import axios from "axios";
import uuid from 'react-uuid'
import { useParams } from "react-router"


export default function Edit() {
    const { id } = useParams()
    const { name } = useParams()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [welcome, setWelcome] = useState(cookies.user)
    const [tickets, setTickets] = useState([])
    const [error, setError] = useState("")
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState("")
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [category, setCategory] = useState("")

    const onTitleChange = e => setTitle(e.target.value)
    const onBodyChange = e => setBody(e.target.value)
    const onCategoryChange = e => setCategory(e.target.value)
    const onCommentChange = e => setComment(e.target.value);


    function handleLogout() {
        removeCookie("user")
    }

    useEffect(() => {
        axios.get("http://localhost:4242/tickets")
            .then(res => setTickets(res.data))
            .catch(err => setError("Error when fetching tickets"));

    }, [])

     function fetchData() {
         axios.get("http://localhost:4242/comments")
            .then(res => { if(Array.isArray(res.data)){setComments(res.data)}else{setError("Error array")}})
            .catch(err => setError("Error when fetching comments"));
    }

    useEffect(() => {
        fetchData()
    }, [])

    function handleDelete(id) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({id: id})
        }
        fetch("http://localhost:4242/delete/comments", requestOptions)
        window.location.reload()
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (body !== "" && title !== "") {
            const data = { id: id, welcome, title, body, category };

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(data)
            }
            fetch("http://localhost:4242/update/tickets", requestOptions)
            window.location.reload()
        }
    }

    function handleCommentSubmit(id) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ id: id, user: cookies.user, comment })
        }
        fetch("http://localhost:4242/comments", requestOptions)
        window.location.reload()
    }

    return (
        <div className="homeContainer">
            <Link to="/login">
                <button className="formButtonHome" onClick={handleLogout}>
                    Logout
                </button>
            </Link>
            <Link to="/">
                <button className="formButtonHome">
                    Home
                </button>
            </Link>
            <div className="home">
                <h2> Welcome to your blog {welcome} !</h2>
                <p>{error}</p>
            </div>
            <div className="tickets">
                {/* <h3> Your last tickets: </h3> */}
                <ul className="list-group list-group-flush">
                    {tickets.map((ticket) => {
                        if (name === ticket.id_user && id === ticket._id) {
                            if (cookies.user === name && ticket._id === id) {
                                return (
                                    <>
                                    
                                        <li className="list-group-item">
                                            Update:
                                        </li>
                                        <li className="list-group-item">
                                            <input className="input-add" onChange={onTitleChange} value={title} placeholder="title" />
                                        </li>
                                        <li className="list-group-item">
                                            <input className="input-add" onChange={onCategoryChange} value={category} placeholder="category" />
                                        </li>
                                        <li className="list-group-item body">
                                            <input className="input-add" onChange={onBodyChange} value={body} placeholder="body" />
                                            <button className="btn btn-add btn-success" onClick={handleSubmit}>Update</button>
                                        </li>
                                        <br />
                                        <li key={uuid()} className="list-group-item">
                                            <u>{ticket.title}</u>
                                        </li>
                                        <li key={uuid()} className="list-group-item category">
                                            <p>category: {ticket.category || "no category"}</p>
                                        </li>
                                        <li key={uuid()} className="list-group-item body">
                                            {ticket.body}
                                        </li>
                                        
                                        <br />
                                    <u>Comment:</u>
                                    <li key={uuid()} className="list-group-item body comment">
                                        <ul>
                                            {comments == [] ? <div className="Chargement">0 comments</div> :
                                                comments.map((comment) => {
                                                    if (ticket._id === comment.ticketid) {
                                                        return (
                                                            <>
                                                                <li>
                                                                    {comment.comment} from -{comment.user} 
                                                                    <button className="del" onClick={() => handleDelete(comment._id)}><i className="far fa-trash-alt"></i></button>
                                                                </li>
                                                            </>
                                                        )
                                                    }
                                                })}
                                        </ul>
                                    </li>
                                    <input className="input-add" value={comment} onChange={onCommentChange} placeholder="Leave a comment" />
                                    <button onClick={() => handleCommentSubmit(ticket._id)} class="btn btn-success btn-comment" type="submit">Add</button>
                               
                                    </>
                                )
                            }
                            return (
                                <>
                                    <li key={uuid()} className="list-group-item">
                                        <u>{ticket.title}</u>
                                    </li>
                                    <li key={uuid()} className="list-group-item category">
                                        <p>category: {ticket.category || "no category"}</p>
                                    </li>
                                    <li key={uuid()} className="list-group-item body">
                                        {ticket.body}
                                    </li>
                                    <br />
                                    <u>Comment:</u>
                                    <li key={uuid()} className="list-group-item body comment">
                                        <ul>
                                            {comments == [] ? <div className="Chargement">0 comments</div> :
                                                comments.map((comment) => {
                                                    if (ticket._id === comment.ticketid) {
                                                        return (
                                                            <>
                                                                <li>
                                                                    {comment.comment} from -{comment.user}
                                                                </li>
                                                            </>
                                                        )
                                                    }
                                                })}
                                        </ul>
                                    </li>
                                    <input className="input-add" value={comment} onChange={onCommentChange} placeholder="Leave a comment" />
                                    <button onClick={() => handleCommentSubmit(ticket._id)} class="btn btn-success btn-comment" type="submit">Add</button>
                                </>
                            )
                        }
                    })}
                </ul>
            </div>
        </div>
    )
}
