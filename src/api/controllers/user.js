const { deleteFile } = require('../../utils/cloudinary/deleteFile');

const { generateSing } = require('../../utils/jwt/jwt');
const Event = require('../models/event');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res, next) => {
  try {
    const { name = '' } = req.query;
    const query = {
      name: { $regex: name, $options: 'i' }
    };
    const allUsers = await User.find(query).select('name email image');

    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(400).json({
      message: 'Error al encontrar los usuarios'
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('name email image ubi description firstName');

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: 'Error al encontrar el usuario'
    });
  }
};

const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userDuplicated = await User.findOne({ email });
    if (userDuplicated) {
      return res.status(400).json({
        message: 'Usuario existente'
      });
    }

    const newUser = new User(req.body);

    newUser.image = 'https://res.cloudinary.com/dusg4mmis/image/upload/v1742721442/users/sj6bpdw5di9hoxwi4pkk.png';

    const user = await newUser.save();
    return res.status(201).json({
      message: 'Usuario creado correctamente',
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error al registratse'
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('name image email password rol');
    if (!user) {
      return res.status(400).json({
        message: 'Usuario o contraseña incorrectos'
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSing(user._id);
      user.password = undefined;
      user.email = undefined;

      // res.cookie('auth_token', token, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: 'Lax',
      //   maxAge: 86400000,
      //   path: '/'
      // });

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 86400000,
        path: '/'
      });

      return res.status(200).json({ user });
    } else {
      return res.status(400).json({
        message: 'Usuario o contraseña incorrectos'
      });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Error al hacer login' });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, ...other } = req.body;

    const oldUser = await User.findById(id);

    if (req.file) {
      if (oldUser.image) {
        deleteFile(oldUser.image);
      }
      other.image = req.file.path;
    }

    const user = await User.findByIdAndUpdate(id, { ...other }, { new: true }).select('name  image rol');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error al actualizar el usuario'
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const events = await Event.find({ idAuthor: id });
    if (events) {
      return res.status(400).json({
        message: 'No puedes eliminar la cuenta con eventos creados'
      });
    }
    const user = await User.findByIdAndDelete(id);
    if (user.image) {
      deleteFile(user.image);
    }
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(400).json({
      message: 'Error al eliminar el usuario'
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 86400000,
    path: '/'
  });
  return res.status(200).json({
    message: 'Sesion cerrada correctamente'
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser,
  logout
};
