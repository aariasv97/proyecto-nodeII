import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendTicketConfirmationEmail = async ({
  email,
  reservationCode,
  eventTitle,
  quantity,
}) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Confirmación de inscripción",
    text: `
      Tu inscripción fue confirmada.

      Evento: ${eventTitle}
      Cantidad de tickets: ${quantity}
      Código de reserva: ${reservationCode}
    `,
  });
};