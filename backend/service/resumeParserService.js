import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const API_URL = "https://resumeparser.app/resume/parse";
const API_KEY = process.env.RESUME_PARSER_API_KEY;

export async function parseResume(filePath) {
    try {
        const form = new FormData();
        form.append("file", fs.createReadStream(filePath));

        const response = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        return response.data;
    } catch (err) {
        console.error("Error parsing resume:", err.response?.data || err.message);
        throw err;
    }
}
