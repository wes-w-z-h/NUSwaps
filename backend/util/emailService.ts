import nodemailer from 'nodemailer';
import env from '../util/validEnv.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any other email service
  auth: {
    user: env.USER_ADDRESS,
    pass: env.APP_PASSWORD,
  },
});

const link =
  env.CURR_ENV === 'DEVELOPMENT'
    ? env.FRONTEND_URL_LOCAL
    : env.FRONTEND_URL_PROD;

const sendVerification = (to: string, token: string) => {
  const mailOptions = {
    from: 'NUSwaps',
    to,
    subject: 'Account Verification',
    html: `<p>Click <a href="${link}/verify/${token}">here</a> to verify your account. Link expires in 5 minutes</p>`,
  };

  return transporter.sendMail(mailOptions);
};

export default sendVerification;
