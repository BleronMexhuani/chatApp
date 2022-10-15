import React from 'react';
import styled from "styled-components";
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Register() {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const handleSubmit = () => {

    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    else {
      axios.post("http://localhost:3001/registerUser", { username: username, email: email, password: password })
        .then((res) => {
          if (res.data) {
            navigate('/chat');
          }
          else {
            toast.error("Email or username is already in use", toastOptions)
          }
          console.log(res.data);
        })
    }
  }

  return (
    <>
      <Container>
        <div className="my-5 form">
          <h4>REGISTER</h4>
          <div className=" ">
            <label htmlFor="Username"></label>
            <input type="text"
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username..' className="form-control" />
          </div>
          <div className=" ">
            <label htmlFor="Email"></label>
            <input type="text"
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email..' className="form-control" />
          </div>
          <div className="">
            <label htmlFor="Password"></label>
            <input type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password..' className="form-control" />
          </div>
          <div>
            <button type='submit' className='btn btn-success my-2' onClick={handleSubmit}>Sign Up</button>
          </div>
          <span className=''>Have an Account already? <Link to="/login">Log In</Link> </span>
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


export default Register