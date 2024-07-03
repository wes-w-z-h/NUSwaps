import nodemailer from 'nodemailer';
import env from '../util/validEnv.js';
import { ISwap } from '../types/api.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any other email service
  auth: {
    user: env.USER_ADDRESS,
    pass: env.APP_PASSWORD,
  },
});

const link = env.FRONTEND_URL;

const sendVerification = (to: string, token: string) => {
  const mailOptions = {
    from: 'NUSwaps',
    to,
    subject: 'Account Verification',
    html: `<p>Click <a href="${link}/verify/${token}">here</a> to verify your account. Link expires in 5 minutes</p>`,
  };

  return transporter.sendMail(mailOptions);
};

const sendMatch = (to: string, swap: ISwap) => {
  const mailOptions = {
    from: 'NUSwaps',
    to,
    subject: 'NUSwaps - Match found',
    html: `<p>We have found a match for your requested swap for ${swap.courseId}. Please accept the match <a href="${link}/dashboard">here</a> as soon as possible.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

export { sendVerification, sendMatch };
