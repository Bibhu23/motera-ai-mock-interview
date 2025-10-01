import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

export default function useInterviewSocket({ url, onQuestion, onAnswerResult, onFinished }) {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (socketRef.current) return;


        const socket = io(url, {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            console.log("✅ Connected:", socket.id);
        });
        socket.on("disconnect", () => {
            setConnected(false);
            console.log("❌ Disconnected");
        });
        socket.on("connect_error", (err) => {
            console.error("⚠️ Connection error:", err.message);
        });

        socket.on("question", (data) => onQuestion && onQuestion(data));
        socket.on("answerResult", (data) => onAnswerResult && onAnswerResult(data));
        socket.on("finished", (data) => onFinished && onFinished(data));

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [url, onQuestion, onAnswerResult, onFinished]);

    const start = useCallback((opts) => {
        socketRef.current?.emit("startInterview", opts);
    }, []);

    const submitAnswer = useCallback((answer) => {
        socketRef.current?.emit("submitAnswer", answer);
    }, []);

    const next = useCallback(() => {
        socketRef.current?.emit("next");
    }, []);

    const prev = useCallback(() => {
        socketRef.current?.emit("prev");
    }, []);
    const finish = useCallback(() => {
        socketRef.current?.emit("finish");
    }, []);


    return { start, submitAnswer, next, prev, finish, connected };
}
