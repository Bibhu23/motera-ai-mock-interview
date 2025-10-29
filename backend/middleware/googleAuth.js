import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:7656/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            // You can save user to DB here
            const user = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value,
            };
            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
