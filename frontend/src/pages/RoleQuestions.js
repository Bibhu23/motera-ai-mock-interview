// frontend/components/RoleQuestions.js
import { useState } from "react";
import Gpi from "../Gpi";

function RoleQuestions() {
    const [role, setRole] = useState("Linux");
    const [questions, setQuestions] = useState([]);

    const fetchQuestions = async () => {
        try {
            const res = await Gpi.get(`/api/questions/generate?role=${role}&difficulty=Easy`);
            setQuestions(res.data.questions);
        } catch (err) {
            console.error("Failed to fetch questions:", err);
        }
    };

    return (
        <div>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Linux">Linux</option>
                <option value="SQL">SQL</option>
                <option value="DevOps">DevOps</option>
                <option value="Docker">Docker</option>
                <option value="JavaScript">JavaScript</option>
                <option value="PHP">PHP</option>
                <option value="Bash">Bash</option>
                <option value="Kubernetes">Kubernetes</option>
                <option value="HTML">HTML</option>
                <option value="WordPress">WordPress</option>
            </select>


            <button onClick={fetchQuestions}>Get Questions</button>

            <ul>
                {questions.map((q, i) => (
                    <li key={i}>
                        <p><strong>{q.question}</strong></p>
                        <ul>
                            {q.options?.map((opt, j) => (
                                <li key={j}>{opt}</li>
                            ))}
                        </ul>
                        {/* Uncomment to show correct answer */}
                        {/* <p><strong>Answer:</strong> {q.answer}</p> */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoleQuestions;
