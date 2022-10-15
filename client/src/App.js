import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Header from './components/Header';
function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const checkAuth = sessionStorage.getItem('loggedin') === true;
  useEffect(() => {
    if (checkAuth) {
      setLoggedIn(true);
    };
  }, [loggedIn])

  return (
    <BrowserRouter>
      <Header />
      <Routes >
        <Route index element={<Login />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='chat' element={<Chat  />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;