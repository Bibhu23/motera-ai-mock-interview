import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/jobs", async (req, res) => {
    const { skill, location } = req.query;

    try {
        const response = await axios.get("https://api.adzuna.com/v1/api/jobs/in/search/1", {
            params: {
                app_id: process.env.APP_ID,
                app_key: process.env.APP_KEY,
                results_per_page: 10,
                what: skill,       // e.g., React Developer
                where: location,   // e.g., Mumbai
            },
        });

        res.json(response.data.results);
    } catch (err) {
        console.error("Error fetching jobs:", err.message);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

export default router;
