import { io } from "socket.io-client";

//const SOCKET_URL = "http://localhost:5000";
const SOCKET_URL = "https://snap-talk-3-bl2l.onrender.com";
const socket = io(SOCKET_URL);

export default socket;