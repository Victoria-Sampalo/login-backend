const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendInvitationEmail = async (fullName, to, token) => {
  const link = `${process.env.FRONTEND_URL}/register?token=${token}`;

  const mailOptions = {
    from: `"Scanner" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Invitación para registrarte en Scanner App',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hola ${fullName},</h2>
        <p>Has sido invitado a registrarte en la plataforma <strong>Scanner</strong>.</p>
        <p>
          <a href="${link}" style="background-color:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
            Completar registro
          </a>
        </p>
        <p style="font-size: 12px; color: #777;">Este enlace expirará en 24 horas.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

  // <p>Hola ${fullName || ''},</p>


   
      // <p>Hola ${fullName || ''},</p>
      // <p>Has sido invitado a registrarte en la plataforma Scanner.</p>
      // <p>Haz clic en el siguiente enlace para completar tu registro:</p>
      // <a href="${link}">${link}</a>
      // <p>Este enlace expirará en 24 horas.</p>
    