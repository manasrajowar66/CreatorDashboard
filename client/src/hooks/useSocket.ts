/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  url: string;
  listeners?: { [event: string]: (...args: any[]) => void };
  autoConnect?: boolean;
}

export const useSocket = ({
  url,
  listeners = {},
  autoConnect = true,
}: UseSocketOptions) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(url, { autoConnect });

    setSocket(newSocket); // Very important

    const handleConnect = () => {
      setIsConnected(true);
      console.log("✅ Socket connected");
    };

    const handleDisconnect = (reason: any) => {
      setIsConnected(false);
      console.warn("❌ Socket disconnected:", reason);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("connect_error", (error) => {
      console.error("🚫 Connection Error:", error.message);
    });

    // Attach custom listeners
    Object.entries(listeners).forEach(([event, callback]) => {
      newSocket.on(event, callback);
    });

    // Cleanup
    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("connect_error");

      Object.entries(listeners).forEach(([event, callback]) => {
        newSocket.off(event, callback);
      });

      newSocket.disconnect();
    };
  }, [url, autoConnect, JSON.stringify(listeners)]);

  return {
    socket,
    isConnected,
  };
};
