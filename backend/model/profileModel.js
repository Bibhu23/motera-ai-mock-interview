import mongoose from "mongoose";
/**fullName: "",
        email: "",
        phone: "",
        title: "",
        city: "",
        country: "",
        experience: "",
        summary: "",
        skills: "",
        hobbies: "",
        workHistory: [],
        education: [],
        resume:null,
        certifications: [], */

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",                          
    required: true,                       
  },
  fullName:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required: true,
  },
  title:{
    type: String,
   
  },
  city:{
    type: String,
   required: true,
  },
  country:{
    type: String,
    required: true,
  },
  experience:{
    type: String,
    required: true,
  },
  summary:{
    type: String,

  },
  skills:{
    type: [String],
    required: true,
  },
  hobbies:{
    type: [String],

  },
  workHistory: [{
    jobTitle: { type: String },
    company: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String }
  }],
  education: [{
    institution: { type: String },
    degree: { type: String },
    fieldOfStudy: { type: String },
    graduationYear: { type: String },
    cgpa: { type: String }
  }],
  resume: {
    type: String,
     // store file path or URL
  },
  certifications: [{
    name: { type: String },
    organization: { type: String },
    dateObtained: { type: String }
  }],
});

export default mongoose.model("Profile", profileSchema);