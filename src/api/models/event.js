const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Types.ObjectId, ref: "users" },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    ubi: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    img: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Conciertos",
        "Festivales",
        "Conferencias",
        "Seminarios",
        "Deportes",
        "Arte",
        "Gastronomía",
        "Tecnología",
        "Moda",
        "Educación",
        "Negocios",
        "Beneficencia",
        "Viajes",
        "Exposiciones",
        "Cine",
        "Teatro",
        "Fiestas",
        "Sociales",
      ],
    },
    attendees: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
    collection: "events",
  }
);

const Event = mongoose.model("events", eventSchema, "events");

module.exports = Event;
