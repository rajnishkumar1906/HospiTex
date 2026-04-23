import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized. No token provided" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      req.userId = decoded.id;
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "User no longer exists" 
        });
      }
      
      req.userRole = user.role;
      req.user = user;
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message || "Invalid or expired token" 
    });
  }
};

export default userAuth;
