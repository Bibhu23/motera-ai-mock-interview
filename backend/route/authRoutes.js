import express from "express";
import passport from "passport";

const router = express.Router();

// Step 1: Start Google login
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback from Google
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (req, res) => {
        // ✅ After successful login, redirect user to your frontend homepage or dashboard
        res.redirect("http://localhost:3000");
    }
);

// (Optional) Get current logged-in user
router.get("/me", (req, res) => {
    if (req.user) res.json(req.user);
    else res.status(401).json({ message: "Not logged in" });
});

// (Optional) Logout route
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("http://localhost:3000/login");
    });
});

export default router;
