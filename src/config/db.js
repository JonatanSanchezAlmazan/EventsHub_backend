const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Conectado a la base de datos con éxito");
    } catch (error) {
        console.log("Error al conectarse a la base de datos");
    }
}

module.exports = { connectDB }