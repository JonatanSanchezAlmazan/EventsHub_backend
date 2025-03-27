const eventsRouter = require("express").Router();
const multer = require("multer");
const { createFolderCloudinary } = require("../../utils/cloudinary/file");
const upload = multer({ storage: createFolderCloudinary("Events") });
const { isAuth, isOrganizer } = require("../../middlewares/isAuth");

const {
  getAllEvents,
  updateEvent,
  deleteEvent,
  postEvents,
  getEventById,
  toogleAttendee,
} = require("../controllers/event");

eventsRouter.post(
  "/user",
  isAuth,
  isOrganizer,
  upload.single("img"),
  postEvents
);
eventsRouter.get("/", getAllEvents);
eventsRouter.get("/:id", getEventById);
eventsRouter.put("/toogleAttendee", isAuth, toogleAttendee);
eventsRouter.put(
  "/:id",
  isAuth,
  isOrganizer,
  upload.single("img"),
  updateEvent
);
eventsRouter.delete("/:id", isAuth, isOrganizer, deleteEvent);

module.exports = eventsRouter;
