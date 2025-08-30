import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      req.userId = decoded.id;
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Login Again" });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default userAuth;
