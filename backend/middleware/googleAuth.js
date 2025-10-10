// npm install passport passport-google-oauth20 express-session
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8214/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Example: save or find user in DB later here
                const user = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                };
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
