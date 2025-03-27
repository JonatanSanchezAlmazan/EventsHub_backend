const { deleteFile } = require('../../utils/cloudinary/deleteFile');
const { sendEmail } = require('../../utils/Email/sendEmail');
const { generateSing } = require('../../utils/jwt/jwt');
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
    console.log(error);
    return res.status(400).json({
      message: 'Error al encontrar los usuarios'
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('name email image');

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
    console.log(error);

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
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 3600000,
        path: '/'
      });
      return res.status(200).json({ user });
    } else {
      return res.status(400).json({
        message: 'Usuario o contraseña incorrectos'
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(400).json({ message: 'Error al hacer login' });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, ...other } = req.body;

    const oldUser = await User.findById(id);

    if (password?.length > 10 || password?.length < 5) {
      return res.status(400).json({
        message: 'La contraseña tiene que tener entre 5 y 10 carácteres'
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      other.password = hashedPassword;
    }

    if (req.file) {
      if (oldUser.image) {
        deleteFile(oldUser.image);
      }
      other.image = req.file.path;
    }

    const userUpdated = await User.findByIdAndUpdate(id, { ...other }, { new: true }).select('name email image rol');

    if (!userUpdated) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      userUpdated
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

module.exports = {
  getAllUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser
};
