
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

export function connectSocket(userId) {
  if (!socket.connected) {
    socket.auth = { userId };
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
