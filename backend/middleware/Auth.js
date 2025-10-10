import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  console.log("AuthMiddleware: token received =", token); // 🔹 check if token exists

  if (!token) {
    console.log("AuthMiddleware: No token provided"); // 🔹 log missing token
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded; // attach decoded payload here

    console.log("AuthMiddleware: decoded user =", req.user); // 🔹 log user info
    next();

  } catch (err) {
    console.log("AuthMiddleware: token invalid", err); // 🔹 log invalid token
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
