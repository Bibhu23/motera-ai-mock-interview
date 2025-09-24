import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    if (decoded.id) {
      if (!req.body) req.body = {};
      req.body.userId = decoded.id;
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, Invalid token" });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
export default authMiddleware;