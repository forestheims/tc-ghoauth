const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies.session;
    if (!cookie) throw new Error('Please sign in to continue');
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};
