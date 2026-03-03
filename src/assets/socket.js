import { io } from "socket.io-client";

// Connect to default namespace
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

export default socket;
