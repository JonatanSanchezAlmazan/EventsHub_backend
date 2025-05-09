const { deleteFile } = require('../../utils/cloudinary/deleteFile');
const Event = require('../models/event');

const postEvents = async (req, res, next) => {
  try {
    const newEvent = new Event(req.body);

    if (req.file) {
      newEvent.image = req.file.path;
    }
    newEvent.idAuthor = req.user._id;
    const event = await newEvent.save();

    return res.status(201).json({
      message: 'Evento creado correctamente',
      event
    });
  } catch (error) {
    return res.status(400).json({
      message: 'No se ha podido crear el evento'
    });
  }
};
const getEventsByAuthor = async (req, res) => {
  try {
    const { idAuthor } = req.params;

    const events = await Event.find({ idAuthor: idAuthor }).populate([
      {
        path: 'idAuthor',
        select: 'name email image'
      },
      {
        path: 'attendees',
        select: 'name  image'
      }
    ]);
    if (!events) {
      return res.status(400).json({
        message: 'No hay eventos que mostrar'
      });
    }
    return res.status(200).json({
      message: 'Eventos',
      events
    });
  } catch (error) {
    return res.status(400).json('Error al mostrar los eventos');
  }
};

const getEventAttendee = async (req, res) => {
  try {
    const { idUser } = req.params;
    const events = await Event.find({ attendees: idUser }).populate([
      {
        path: 'idAuthor',
        select: 'name email image'
      },
      {
        path: 'attendees',
        select: 'name  image'
      }
    ]);
    if (!events) {
      return res.status(400).json({
        message: 'No hay eventos que mostrar'
      });
    }
    return res.status(200).json({
      message: 'Eventos',
      events
    });
  } catch (error) {
    return res.status(400).json('Error al mostrar los eventos');
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const { direction = '', title = '', category } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (direction) {
      query.direction = { $regex: direction, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (category === 'Todo' && direction === 'Todo') {
      const events = await Event.find();
      return res.status(200).json({
        events: events
      });
    }

    const events = await Event.find(query);

    return res.status(200).json({
      events: events
    });
  } catch (error) {
    return res.status(400).json('Error al mostrar los eventos');
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { idEvent } = req.params;
    const event = await Event.findById(idEvent).populate([
      {
        path: 'idAuthor',
        select: 'name email image'
      },
      {
        path: 'attendees',
        select: 'name  image'
      }
    ]);
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json('Error al mostrar el evento');
  }
};

const toogleAttendee = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);

    if (event.idAuthor.toString() === userId) {
      return res.status(400).json({
        message: 'No puedes asistir a un evento tuyo'
      });
    }
    if (event.capacity === event.attendees.length) {
      return res.status(400).json({
        message: 'Evento completo'
      });
    }

    const isAttendee = event.attendees.includes(userId);
    const updatedEvent = await Event.findByIdAndUpdate(eventId, isAttendee ? { $pull: { attendees: userId } } : { $addToSet: { attendees: userId } }, { new: true });
    return res.status(200).json({
      message: isAttendee ? `Has dejade de asistir a ${event.title}` : `Añadido al evento ${event.title}`,
      updatedEvent
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error al añadir o eliminar asistente' });
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldEvent = await Event.findById(id);

    const updateData = {};

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== 'undefined' && req.body[key] !== '') {
        updateData[key] = req.body[key];
      }
    });

    if (req.file) {
      updateData.image = req.file.path;
      deleteFile(oldEvent.image);
    }

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({ message: 'Evento actualizado correctamente', event });
  } catch (error) {
    return res.status(400).json({ message: 'Error al actualizar el evento' });
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (event.attendees.length > 0) {
      return res.status(400).json({
        message: 'No puedes eliminar un evento con asistentes'
      });
    }
    deleteFile(event.image);
    return res.status(200).json({
      message: 'Evento eliminado correctamente',
      event
    });
  } catch (error) {
    return res.status(400).json('Error');
  }
};

module.exports = {
  postEvents,
  getAllEvents,
  getEventById,
  getEventsByAuthor,
  getEventAttendee,
  updateEvent,
  toogleAttendee,
  deleteEvent
};
