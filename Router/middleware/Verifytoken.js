const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: "No token provided" 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
};

module.exports = { verifyToken };