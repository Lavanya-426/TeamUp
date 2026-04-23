const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Verification required. Please verify your email.",
        code: "TOKEN_MISSING",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid session. Please verify again.",
        code: "TOKEN_FORMAT_INVALID",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.verified) {
      return res.status(403).json({
        message: "Email not verified.",
        code: "NOT_VERIFIED",
      });
    }

    req.email = decoded.email;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please verify your email again.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      message: "Invalid session. Please verify again.",
      code: "TOKEN_INVALID",
    });
  }
};
