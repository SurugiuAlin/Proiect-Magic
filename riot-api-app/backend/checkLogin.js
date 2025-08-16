const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return jsonResponse(res, false, 401, [], 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return jsonResponse(res, false, 401, [], 'Invalid token');
  };
}

module.exports = checkLogin; 