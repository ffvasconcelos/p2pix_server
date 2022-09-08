const express = require('express')
const {createServer} = require('http')
const {Server} = require('socket.io')
const http = require("http");
const {addConnection, array, removeConnection} = require("./clientManagement");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    path: '/p2pix_connect',
    connectTimeout: 30000,
    pingTimeout: 270000,
});

io.on("connection", (socket) => {
    try {
        socket.on("disconnect", (reason) => {
            removeConnection(socket.id)
        })

        socket.on("addClient", (args) => {
            try {
                addConnection(args, socket)
            } catch (error) {
                console.log(error)
            }
        })

    } catch (error) {
        console.log(error)
    }
});

app.get('/', (req, res) => {
    try {
        res.send(array).status(200)
    } catch (error) {
        console.log(error)
        res.send(error).status(500)
    }
})

app.get('/getData', ({query}, res) => {
    try {
        const sender = query.sender
        const receiver = query.receiver
        const value = Number.parseFloat(query.value).toFixed(2)

        const origin = array.find(el => el.name === sender)

        if (!origin) {
            console.log("Invalid client, denied access")
            res.send("Invalid client").status(404)
            return
        }

        const destiny = array.find(el => el.name === receiver)

        if (!destiny) {
            console.log("Receiver not found")
            res.send("Not found receiver").status(404)
            return
        }

        console.log(`${origin.ip} enviou R$${value} para ${destiny.ip}`)

        res.send({ip: destiny.ip}).status(200)
    } catch (error) {
        console.log(error)
        res.send(error).status(500)
    }
})

httpServer.listen(8000, () => {
    console.log('Server listening to port 8000')
});