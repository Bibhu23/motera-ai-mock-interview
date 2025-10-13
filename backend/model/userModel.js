import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    experienceYears: { type: Number, required: true, default: 3 }, //default year=0
    creditBalance: { type: Number, default: 5 },
    skills: { type: [String], default: [] },
    // Interview tracking fields
    resumeScore: { type: Number, default: null },
    resumeDate: { type: Date, default: null },
    writtenScore: { type: Number, default: null },
    writtenDate: { type: Date, default: null },
    technicalScore: { type: Number, default: null },
    technicalDate: { type: Date, default: null },
    hrStatus: { type: String, default: "Pending" },
    hrScore: { type: Number, default: null },
    hrDate: { type: Date, default: null }

});

export default mongoose.model("User", userSchema);
