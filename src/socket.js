import { io } from "socket.io-client";
const URl = "http://localhost:8000";
const socket = io(URl, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
