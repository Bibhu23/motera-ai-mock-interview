import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    skills: { type: [String], default: [] },
    phone: { type: String },
    linkedInUrl: { type: String },
    resumeUrl: { type: String },
    creditBalance: { type: Number, default: 5 },

    // === New fields for interview rounds ===
    resumeScore: { type: Number, default: null },       // Round 1
    resumeDate: { type: Date, default: null },

    writtenScore: { type: Number, default: null },      // Round 2
    writtenDate: { type: Date, default: null },

    technicalScore: { type: Number, default: null },    // Round 3
    technicalDate: { type: Date, default: null },

    hrStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" }, // Round 4
    hrDate: { type: Date, default: null }
});

export default mongoose.model("User", userSchema);
