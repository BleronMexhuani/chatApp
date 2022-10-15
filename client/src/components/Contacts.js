import React from 'react';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";

function Contacts() {

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [message, setMessage] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState();
  const msg = useRef();
  const socket = useRef();
  const host = "http://localhost:3001";

  var currentUser = JSON.parse(sessionStorage.getItem("loggedin"));

  useEffect(() => {
    axios.get(`http://localhost:3001/getContacts/${currentUser.id}`).then((res) => {
      setContacts(res.data);
    })
  }, [])

  useEffect(() => {
    if (currentChat.length > 0) {
      
      async function ChatMsg() {
        const response = await axios.post("http://localhost:3001/receiveMessages", {
          from: currentUser.id,
          to: currentChat[0].id
        });

        setMsgs(response.data);

        socket.current = io(host);
        socket.current.emit("add-user", currentUser.id);
      }
      ChatMsg();
    }

  }, [currentChat]);


  const sendMsg = (id) => {
    const user = currentUser.id;
    axios.post("http://localhost:3001/sendMsg", { message, id, user }).then((res) => {

      socket.current.emit("send-msg", {
        to: id,
        from: currentUser.id,
        message: message
      });
      const msgsSet = [...msgs];

      msgsSet.push({ fromSelf: true, message: message });

      setMsgs(msgsSet);
      msg.current.value = null;
    })
  }

  function handleSetChat(id) {
    axios.get(`http://localhost:3001/getUsers/${id}`).then((res) => {
      setCurrentChat(res.data);
    })
  }
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (message) => {
        setArrivalMessage({ fromSelf: false, message: message });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    arrivalMessage && setMsgs((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  return (
    <Container>
      <div className='items'>
        Click a user to chat
        {contacts.map((item, key) => (<div className='users' key={item.id} onClick={() => handleSetChat(item.id)}>
          {item.username}
          <br />
        </div>))}
      </div>
      <div className="chat">
        <h3>
          {currentChat.length == 1 ? <span>The chat</span> : null}
        </h3>
        {currentChat.map((item, key) => (<div className='' key={item.id}>
          <h3 > {item.username}</h3>
          <br />
          <div className="chatMessages">
            {msgs.map((item) => (<div key={uuidv4()} className={`chat ${item.fromSelf ? "sended" : "recieved"
              }`}>
              {item.message}
            </div>
            ))}
          </div>
          <div className="row">
            <div className="col-12">
              <input type="text" className='form-control' ref={msg} onChange={(e) => setMessage(e.target.value)} />
              <button className='btn btn-primary btn-sm w-100' onClick={() => sendMsg(item.id)}>Send Msg</button>
            </div>
          </div>
        </div>
        ))}


      </div>
    </Container >
  )
}
const Container = styled.div`
display:flex;
.items {
  width:50%;
  height:50%;
  .users {
    border:1px solid #dfdfdf;
    font-size:20px;
    padding:20px;
    margin:10px;
    cursor:pointer;  
  }
}
.chat {
  width:80%;

}
.usersChat{
  font-size:50px;
}
.chatMessages {

  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
.sended {
  justify-content: flex-end;
  text-align:end;
}
.recieved {
  justify-content: flex-start;

  }
}
`;
export default Contacts