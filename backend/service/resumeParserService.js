import axios from "axios";

const API_URL = "https://resumeparser.app/resume/parse";
const API_KEY = process.env.RESUME_PARSER_API_KEY; // your ResumeParser API key

export async function parseResume(base64File) {
    try {
        const response = await axios.post(
            API_URL,
            { file: base64File }, // JSON body with base64
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;

    } catch (err) {
        console.error("Error parsing resume:", err.response?.data || err.message);
        throw err;
    }
}
