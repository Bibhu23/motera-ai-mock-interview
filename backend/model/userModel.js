import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name: { type: String, 
          required: true },
    email: { type: String, 
            required: true, unique:
            true, index: true },
    password: { type: String, 
        required: true },
    role: { type: String,
        
         required: true },
    experienceYears: { type: Number, 
        required: true },
    skills: { type: [String],
         default: [] },
    phone: { type: String },
    linkedInUrl: { type: String },
    resumeUrl: { type: String } 
})
export default mongoose.model("User", userSchema);
