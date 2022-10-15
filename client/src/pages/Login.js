import React from 'react';
import styled from "styled-components";
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };
    const handleSubmit = () => {
        axios.post("http://localhost:3001/login", { username: username, password: password }).then((res) => {
            if (res.data) {
                console.log(res.data)
                sessionStorage.setItem('loggedin', JSON.stringify(res.data));
             
             navigate('/chat');
            }
            else {
                toast.error("Username or password are incorrect", toastOptions)
            }
        })
    }
    return (
        <>
            <Container>
                <div className="my-5 form">
                    <h4>LOG IN</h4>
                    <div className=" ">
                        <label htmlFor="Username"></label>
                        <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder='Username..' className="form-control" />
                    </div>
                    <div className="">
                        <label htmlFor="Password"></label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Password..' className="form-control w-100" />
                    </div>
                    <div>
                        <button type='submit' onClick={handleSubmit} className='btn btn-success my-2'>Sign In</button>
                    </div>
                    <span className=''>Dont have an Account? <Link to="/register">Register</Link> </span>

                </div>
                <ToastContainer />
            </Container>
        </>
    )
}
const Container = styled.div`
  text-align:center;
  display:flex;
  justify-content:center;
  .form {
      border:1px solid #dfdfdf;
      padding:5%;
      border-radius:20px;
  }
`;


export default Login