const eventsRouter = require('express').Router();
const multer = require('multer');
const { createFolderCloudinary } = require('../../utils/cloudinary/file');
const upload = multer({ storage: createFolderCloudinary('Events') });
const { isAuth, isOrganizer } = require('../../middlewares/isAuth');

const { getAllEvents, updateEvent, deleteEvent, postEvents, getEventById, toogleAttendee, getEventsByAuthor, getEventAttendee } = require('../controllers/event');

eventsRouter.post('/register', isAuth, isOrganizer, upload.single('image'), postEvents);
eventsRouter.get('/attendee/:idUser', isAuth, getEventAttendee);
eventsRouter.get('/', getAllEvents);
eventsRouter.put('/toggleAttendee', isAuth, toogleAttendee);
eventsRouter.get('/author/:idAuthor', isAuth, getEventsByAuthor);
eventsRouter.get('/event/:idEvent', getEventById);
eventsRouter.put('/:id', isAuth, isOrganizer, upload.single('image'), updateEvent);
eventsRouter.delete('/:id', isAuth, isOrganizer, deleteEvent);

module.exports = eventsRouter;
