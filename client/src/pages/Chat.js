import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import Contacts from '../components/Contacts';

function Chat() {
  const checkAuth = sessionStorage.getItem('loggedin');
  useEffect(() => {
    if (!checkAuth) {
      navigate('/login')
    };
  }, [checkAuth])

  const navigate = useNavigate();

  return (
    <Container>
      <Contacts />
    </Container>
  )
}
const Container = styled.div`

`;

export default Chat