const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendInvitationEmail = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/register?token=${token}`;

  const mailOptions = {
    from: `"Scanner" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Invitación para registrarte en Scanner App',
    html: `
      <p>Has sido invitado a registrarte en la plataforma Scanner.</p>
      <p>Haz clic en el siguiente enlace para completar tu registro:</p>
      <a href="${link}">${link}</a>
      <p>Este enlace expirará en 24 horas.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
