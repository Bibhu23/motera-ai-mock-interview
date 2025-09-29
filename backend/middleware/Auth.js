import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded; // attach decoded payload here
    next();

  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
export default authMiddleware;