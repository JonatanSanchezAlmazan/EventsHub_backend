const nodemailer = require("nodemailer");

const sendEmail = (user) => {
  const { name, email, _id } = user;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  const url = `http://localhost:5173/verify/?id=${_id}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #007bff; text-align: center;">¡Verifica tu correo!</h1>
    <p>Hola ${name},</p>
    <p>Gracias por registrarte en nuestra plataforma. Por favor, confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
    
    <div style="text-align: center; margin: 20px;">
      <a href="${url}" target="_self" style="text-decoration: none; color: #fff; background-color: #007bff; padding: 10px 20px; border-radius: 5px;">
        Verificar correo electrónico
      </a>
    </div>
    
    <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
    
    <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
      <p>&copy;Jonatan Sanchez 2024 Service & Events. Todos los derechos reservados.</p>
    </footer>
  </div>
`;

  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: email,
      subject: "Verificación de correo",
      html: htmlContent,
    },
    (error, info) => {
      if (error) {
        console.log("Error al enviar el correo", error);
      } else {
        console.log("Correo enviado correctamente", info.response);
      }
    }
  );
};

module.exports = { sendEmail };
