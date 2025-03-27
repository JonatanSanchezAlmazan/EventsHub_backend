const User = require('../api/models/user');
const { verifyToken } = require('../utils/jwt/jwt');

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        message: 'Parece que tu sesión ha caducado. Vuelve a iniciar sesión para continuar.'
      });
    }

    const { id } = verifyToken(token);
    const user = await User.findById(id).select('name email image reservations isOwner');

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'No estás autorizado'
    });
  }
};

const isOrganizer = async (req, res, next) => {
  if (req.user.rol === 'organizer') {
    next();
  } else {
    return res.status(401).json({ message: 'No estás autorizado' });
  }
};

module.exports = { isAuth, isOrganizer };
