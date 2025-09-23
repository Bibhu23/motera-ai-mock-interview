import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useInterviewSocket({ url, onQuestion, onAnalysis, onFinished }) {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (socketRef.current) return; // prevent reconnect

        const socket = io(url || "http://localhost:7656", {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));
        socket.on("question", (payload) => onQuestion?.(payload));
        socket.on("analysis", (payload) => onAnalysis?.(payload));
        socket.on("finished", (payload) => onFinished?.(payload));
        socket.on("error", (e) => console.error("Socket error:", e));

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [url, onQuestion, onAnalysis, onFinished]);

    const start = (opts) => socketRef.current?.emit("startInterview", opts);
    const submitAnswer = (payload) => socketRef.current?.emit("submitAnswer", payload);

    return { start, submitAnswer, connected };
}