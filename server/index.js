const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')

const socket = require('socket.io')

const app = express()
const port = 3001


app.use(express.json());
app.use(cors());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "node"
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    con.query("SELECT * FROM users WHERE username = ?", [username], (err, result, fields) => {
        if (result.length > 0) {
            const comparePassword = bcrypt.compareSync(password, result[0].password);
            if (comparePassword) {
                res.json({
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email
                });
            }
            else {
                res.send(false);
            }
        }
        else {
            res.send(false);
        }
    })
})

app.post('/registerUser', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (err, hash) => {
        con.query("INSERT INTO users (username,email,password) VALUES(?,?,?)", [username, email, hash], (err, result) => {
            if (err) {
                res.send(false)
            }
            else {
                res.send(true);
            }
        })
    });
})

app.get('/getContacts/:id', (req, res) => {
    let id = req.params.id;
    con.query("SELECT * FROM users WHERE id != ?", [id], (err, result) => {
        res.send(result);
    })
})

app.get('/getUsers/:id', (req, res) => {
    let id = req.params.id;
    con.query("SELECT id,username,email FROM users WHERE id = ? ", [id], (err, result) => {
        res.send(result);
    })
})


app.post('/sendMsg', (req, res) => {

    let id = req.body.id;
    let message = req.body.message;
    let user_id = req.body.user;

    con.query("INSERT INTO messages (sender_id,receiver_id,message) VALUES(?,?,?)", [user_id, id, message], (err, result) => {
        if (err) {
            res.send("Message is not sent");
        }
        else {
            res.send("Message is sent succesfully");
        }
    })
})

app.post('/receiveMessages', async (req, res) => {
    const { from, to } = req.body;
    const messages = null;
    con.query("SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (receiver_id=? AND sender_id=?) ",
        [from, to, from, to], (err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                const projectedMessages = result.map((msg) => {
                    return {
                        fromSelf: msg.sender_id === from,
                        message: msg.message,
                    };
                });
                res.send(projectedMessages);
            }
        })
})

const server = app.listen(port, () => console.log(`App listening on port ${port}!`))

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);

    });


    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});
