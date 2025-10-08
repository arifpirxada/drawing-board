import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
    autoConnect: false,
    transports: ['websocket'],
});

export default socket;

export function connectSocket(opts = {}) {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}