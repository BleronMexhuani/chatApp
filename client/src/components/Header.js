import React from 'react'
import {
    Link
} from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import '../App.css';
import styled from 'styled-components';

function Header() {
    return (
        <Container>
            <Navbar bg="light" variant="light">
                <Navbar.Brand href="/home">Logo</Navbar.Brand>
                <div className="mx-auto fs-5">
                    <Nav className="navbar">
                        <span className='ms-3'> <Link style={{ textDecoration: 'none' }} to="/login">Log-in</Link> </span>
                        <span className='ms-3'> <Link style={{ textDecoration: 'none' }} to="/register">Register</Link> </span>
                        <span className='ms-3'> <Link style={{ textDecoration: 'none' }} to="/chat">Chat</Link> </span>
                    </Nav>
                    <div className=""></div>
                </div>
            </Navbar>
        </Container>

    )
}
const Container = styled.div`

.navbar{
  
}   

`;

export default Header