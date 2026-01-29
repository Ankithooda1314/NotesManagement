import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    // Authorization header: "Bearer TOKEN"
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token not found" });

    const token = authHeader.split(" ")[1]; // "Bearer TOKEN"
    if (!token) return res.status(401).json({ message: "Token not found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export default isAuth;
