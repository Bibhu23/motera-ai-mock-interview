import express from "express";
import passport from "../middleware/googleAuth.js";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Redirect back to your frontend
        res.redirect("http://localhost:3000/dashboard");
    }
);

export default router;
