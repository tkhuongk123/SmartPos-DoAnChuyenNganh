const path = require("path");
const port = 8000;
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const routes = require("./src/routes");
const db = require("./src/config/db");

const app = express();

// ====== CONNECT DB ======
db.connect();

// ====== CORS ======
app.use(cors());

// ====== MIDDLEWARE ======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ====== ROUTES ======
routes(app);

// ====== STATIC FOLDER ======
app.use("/public", express.static(path.join(__dirname, "public")));

// ====== CREATE HTTP SERVER ======
const server = http.createServer(app);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ====== INIT SOCKET ======
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Cho controller sử dụng io
app.set("io", io);

// ====== SOCKET EVENTS ======
require("./src/sockets")(io);

// ====== LISTEN ======
server.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});

