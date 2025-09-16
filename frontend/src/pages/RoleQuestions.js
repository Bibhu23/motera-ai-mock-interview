import { useState } from "react";
import Gpi from "../Gpi";

function RoleQuestions() {
    const [role, setRole] = useState("React Developer");
    const [questions, setQuestions] = useState([]);

    const fetchQuestions = async () => {
        try {
            const res = await Gpi.get(`/api/questions/generate?role=${role}&difficulty=Easy`);

            // res.data.questions will always be an array
            setQuestions(res.data.questions);
        } catch (err) {
            console.error("Failed to fetch questions:", err);
        }
    };

    return (
        <div>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>React Developer</option>
                <option>Data Analyst</option>
                <option>Backend Developer</option>
            </select>
            <button onClick={fetchQuestions}>Get Questions</button>

            <ul>
                {questions.map((q, i) => (
                    <li key={i}>{q}</li>
                ))}
            </ul>
        </div>
    );
}

export default RoleQuestions;
