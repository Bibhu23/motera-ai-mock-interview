import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, experienceYears, skills, phone, linkedInUrl } = req.body;
    console.log("Uploaded file:", req.file);

    const user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });

    }
    const passwordHash = await bcrypt.hash(password, 10);
    const resumePath = req.file ? req.file.path : null;
    const newUser = new User({
      name: name,
      email: email,
      password: passwordHash,
      role: role,
      experienceYears: experienceYears,
      skills: skills,
      phone: phone,
      linkedInUrl: linkedInUrl,
      resumeUrl: resumePath
    })
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.SECRETKEY, { expiresIn: "1h" });


    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in registering user" });

  }

}
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Unauthorized user" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.log(error.message);
    return res.status(403).json({ message: "error during login " })

  }
};
export const userCredit = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, creditBalance: user.creditBalance, user: { name: user.name } });


  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });

  }
}
export { registerUser, loginUser };