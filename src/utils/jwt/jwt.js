const jwt = require("jsonwebtoken");

const generateSing = (id) =>
    jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1y" });


const verifyToken = (token) =>
    jwt.verify(token, process.env.SECRET_KEY);


module.exports = { generateSing, verifyToken }