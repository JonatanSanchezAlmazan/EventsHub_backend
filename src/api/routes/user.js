const multer = require('multer');
const { createFolderCloudinary } = require('../../utils/cloudinary/file');
const upload = multer({ storage: createFolderCloudinary('Users') });
const { isAuth } = require('../../middlewares/isAuth');

const { register, getAllUsers, login, updateUser, getUserById, deleteUser, verify } = require('../controllers/user');

const usersRouter = require('express').Router();

usersRouter.post('/register', upload.single('image'), register);
usersRouter.post('/login', login);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.put('/:id', isAuth, upload.single('image'), updateUser);
usersRouter.delete('/:id', isAuth, deleteUser);

module.exports = usersRouter;
