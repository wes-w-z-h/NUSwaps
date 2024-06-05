import nodemailer from 'nodemailer';
import env from '../util/validEnv.js';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any other email service
  auth: {
    user: env.USER_ADDRESS,
    pass: env.APP_PASSWORD,
  },
});

const sendVerification = (to: string, token: string) => {
  const mailOptions = {
    from: 'NUSwaps',
    to,
    subject: 'Account Verification',
    html: `<p>Click <a href="http://localhost:4000/api/auth/verify/${token}">here</a> to verify your account.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

export default sendVerification;
