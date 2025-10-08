import { useEffect, useRef, useState, useCallback } from "react";
import socket, { connectSocket, disconnectSocket } from "../../socket";

export default function useSocket({ autoConnect = true } = {}) {
  const [connected, setConnected] = useState(socket.connected);
  const listenersRef = useRef(new Map());

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (autoConnect) connectSocket();

    const handleBeforeUnload = (event) => {
      event.returnValue = ''; // Shows generic browser dialog
      event.returnValue = ''; // Triggers browser dialog to warn user about unsaved changes before leaving the page
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      // clean up any listeners registered via `on`
      for (const [event, handler] of listenersRef.current) {
        socket.off(event, handler);
      }
      listenersRef.current.clear();

      disconnectSocket();

       window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [autoConnect]);

  const on = useCallback((event, handler) => {
    listenersRef.current.set(event, handler);
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
      listenersRef.current.delete(event);
    };
  }, []);

  const emit = useCallback((event, ...args) => {
    socket.emit(event, ...args);
  }, []);

  const off = useCallback((event, handler) => {
    socket.off(event, handler);
    listenersRef.current.delete(event);
  }, []);

  return { connected, on, off, emit, raw: socket };
}
