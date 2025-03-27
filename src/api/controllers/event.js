const { deleteFile } = require("../../utils/cloudinary/deleteFile");
const { printInfo } = require("../../utils/functions/printInfo");
const { dataPerPage } = require("../../utils/variable/pagination");
const Event = require("../models/event");

const postEvents = async (req, res, next) => {
  try {
    const newEvent = new Event(req.body);

    if (req.file) {
      newEvent.img = req.file.path;
    }

    const event = await newEvent.save();

    return res.status(201).json({
      message: "Evento creado correctamente",
      event,
    });
  } catch (error) {
    return res.status(400).json({
      message: "No se ha podido crear el evento",
    });
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const {
      page = 1,
      category = "",
      date = "",
      hour = "",
      title = "",
      creatorName = "",
    } = req.query;

    const total = await Event.countDocuments();
    const lastPage = Math.ceil(total / dataPerPage);

    if (page > lastPage || page < 1) {
      return res.json({
        info: printInfo(total, lastPage, parseInt(page), "events"),
        events: [],
      });
    }

    const events = await Event.find()
      .skip((page - 1) * dataPerPage)
      .limit(dataPerPage)
      .populate({
        path: "creator",
        select: "name email image",
      })
      .sort({ createdAt: -1 });

    const filteredEvents = events.filter((event) => {
      return (
        (!category || new RegExp(category, "i").test(event.category)) &&
        (!date || new RegExp(date, "i").test(event.date)) &&
        (!hour || new RegExp(hour, "i").test(event.hour)) &&
        (!title || new RegExp(title, "i").test(event.title)) &&
        (!creatorName ||
          (event.creator &&
            new RegExp(creatorName, "i").test(event.creator.name)))
      );
    });

    return res.status(200).json({
      info: printInfo(total, lastPage, parseInt(page), "events"),
      events: filteredEvents,
    });
  } catch (error) {
    return res.status(400).json("Error al mostrar los eventos");
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate({
      path: "creator",
      select: "name email image",
    });
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json("Error al mostrar el evento");
  }
};

const toogleAttendee = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);
    const isAttendee = event.attendees.includes(userId);
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      isAttendee
        ? { $pull: { attendees: userId } }
        : { $addToSet: { attendees: userId } },
      { new: true }
    );
    return res.status(200).json({
      mesaage: "Assistente añadido o eliminado correctamente",
      updatedEvent,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error al añadir o eliminar asistente" });
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldEvent = await Event.findById(id);

    const updateData = {};

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== "undefined" && req.body[key] !== "") {
        updateData[key] = req.body[key];
      }
    });

    if (req.file) {
      updateData.img = req.file.path;
      deleteFile(oldEvent.img);
    }

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

    return res
      .status(200)
      .json({ message: "Evento actualizado correctamente", event });
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar el evento" });
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    deleteFile(event.img);
    return res.status(200).json({
      message: "Evento eliminado correctamente",
      event,
    });
  } catch (error) {
    return res.status(400).json("Error");
  }
};

module.exports = {
  postEvents,
  getAllEvents,
  getEventById,
  updateEvent,
  toogleAttendee,
  deleteEvent,
};
