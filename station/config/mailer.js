import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurer nodemailer
export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL, // Votre adresse email
    pass: process.env.EMAIL_PASSWORD // Votre mot de passe email
  }
});

const sendMfaCode = async (email, mfaCode) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Votre code MFA',
    text: `Votre code MFA est ${mfaCode}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Code MFA envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code MFA :', error);
  }
};

export default sendMfaCode;
