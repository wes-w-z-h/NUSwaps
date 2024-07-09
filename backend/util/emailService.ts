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

const sendGeneric = (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: 'NUSwaps',
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export const sendVerification = (to: string, token: string) => {
  const subject = 'Account Verification';
  const html = `<p>Click <a href="${link}/verify/${token}">here</a> to verify your account. Link expires in 5 minutes</p>`;
  return sendGeneric(to, subject, html);
};

export const sendMatchFound = (to: string, swap: ISwap) => {
  const subject = 'NUSwaps - Match found';
  const html = `<p>We have found a match for your requested swap for ${swap.courseId}. Please accept the match <a href="${link}/dashboard">here</a> as soon as possible.</p>`;
  return sendGeneric(to, subject, html);
};

export const sendMatchRejected = (to: string, swap: ISwap) => {
  const subject = 'NUSwaps - Match rejected';
  const html = `Your requested swap for ${swap.courseId} has been declined by the other party. We will actively find another match for you.`;
  return sendGeneric(to, subject, html);
};

export const sendMatchAccepted = (to: string, swap: ISwap) => {
  const subject = 'NUSwaps - Match accepted';
  const html = `Your requested swap for ${swap.courseId} has been accepted by all parties.`;
  return sendGeneric(to, subject, html);
};
