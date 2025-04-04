const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    idAuthor: { type: mongoose.Types.ObjectId, ref: 'users' },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    direction: { type: String, required: true, trim: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Conciertos', 'Festivales', 'Conferencias', 'Seminarios', 'Deportes', 'Arte', 'Gastronomía', 'Tecnología', 'Moda', 'Educación', 'Negocios', 'Beneficencia', 'Viajes', 'Exposiciones', 'Cine', 'Teatro', 'Fiestas', 'Sociales']
    },
    attendees: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    capacity: { type: Number, required: true }
  },
  {
    timestamps: true,
    collection: 'events'
  }
);

const Event = mongoose.model('events', eventSchema, 'events');

module.exports = Event;
