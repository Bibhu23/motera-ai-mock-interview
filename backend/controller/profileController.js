import User from "../model/userModel.js";
import Profile from "../model/profileModel.js"
// GET /user/api/v1/profile/get

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      // User has not created a profile yet
      return res.status(404).json({ message: "No profile found. Please create one." });
    }

    res.status(200).json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// POST /user/api/v1/profile/update



export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from token (no need from frontend)
    const {
      fullName,
      email,
      phone,
      title,
      city,
      country,
      experience,
      summary,
      skills,
      hobbies,
      workHistory,
      education,
      certifications,
    } = req.body;

    // Parse JSON strings from FormData
    let parsedWorkHistory = [];
    let parsedEducation = [];
    let parsedCertifications = [];

    try {
      parsedWorkHistory = workHistory ? JSON.parse(workHistory) : [];
      parsedEducation = education ? JSON.parse(education) : [];
      parsedCertifications = certifications ? JSON.parse(certifications) : [];
    } catch (parseError) {
      console.error("Error parsing JSON from FormData:", parseError);
    }

    // ✅ File handling (if uploaded)
    const resumePath = req.files?.resume ? req.files.resume[0].path : null;
    const certificationsPaths = req.files?.certifications
      ? req.files.certifications.map((file) => file.path)
      : [];

    // ✅ Find existing profile
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // 🔄 Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId },
        {
          fullName,
          email,
          phone,
          title,
          city,
          country,
          experience,
          summary,
          skills: Array.isArray(skills) ? skills : skills?.split(","),
          hobbies: Array.isArray(hobbies) ? hobbies : hobbies?.split(","),
          workHistory: parsedWorkHistory,
          education: parsedEducation,
          ...(resumePath && { resume: resumePath }),
          ...(certificationsPaths.length && { certifications: certificationsPaths }),
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } else {
      // 🆕 Create new profile
      const newProfile = new Profile({
        userId,
        fullName,
        email,
        phone,
        title,
        city,
        country,
        experience,
        summary,
        skills: Array.isArray(skills) ? skills : skills?.split(","),
        hobbies: Array.isArray(hobbies) ? hobbies : hobbies?.split(","),
        workHistory: parsedWorkHistory,
        education: parsedEducation,
        resume: resumePath,
        certifications: certificationsPaths,
      });

      await newProfile.save();

      return res.status(201).json({
        message: "Profile created successfully",
        profile: newProfile,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
