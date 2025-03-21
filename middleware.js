const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ error: "❌ الوصول ممنوع، لا يوجد توكن" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "❌ التوكن غير صالح" });
  }
};

module.exports = authenticateToken;
