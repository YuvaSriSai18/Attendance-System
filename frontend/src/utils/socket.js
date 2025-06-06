import { io } from "socket.io-client";

const socket = io("https://rbnfh5ks-5200.inc1.devtunnels.ms/", {
    transports: ["websocket"], 
});

export default socket;
