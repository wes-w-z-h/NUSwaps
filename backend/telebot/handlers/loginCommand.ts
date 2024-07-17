import createHttpError from 'http-errors';
import * as bcrypt from 'bcrypt';
import { CustomContext } from '../types/context.js';
import UserModel from '../../models/userModel.js';

const loginCommand = async (ctx: CustomContext) => {
  const HELP_TEXT =
    '❗Email must end in @u.nus.edu\n\n' +
    'Example usage:\n' +
    '/login <email@u.nus.edu> <password>';

  const fullMessage = ctx.message?.text ?? '';
  const [, ...args] = fullMessage.trim().split(/\s+/); // Regex to split by whitespace

  if (ctx.from?.id && (await UserModel.find({ telegramId: ctx.from.id }))) {
    await ctx.reply('Already logged in!');
    return;
  }

  if (args.length !== 2) {
    await ctx.reply(HELP_TEXT);
    return;
  }

  if (args[0].toLowerCase() === 'help') {
    await ctx.reply(HELP_TEXT);
    return;
  }

  const email = args[0].toLowerCase();
  const password = args[1];

  // check domain name
  if (!email.endsWith('@u.nus.edu')) {
    throw createHttpError(400, 'Invalid email');
  }

  const data = await UserModel.findOne({ email });

  if (!data) {
    throw createHttpError(404, 'User not found');
  }

  const valid = await bcrypt.compare(password, data.password);
  if (!valid) {
    throw createHttpError(401, 'Unauthorised: check email & password');
  }

  ctx.session.userId = data.id;

  if (!ctx.from?.id) {
    throw createHttpError(404, 'Id is missing');
  }
  const updated = await UserModel.findByIdAndUpdate(data.id, {
    telegramId: ctx.from.id,
  });

  if (!updated) {
    throw createHttpError(400, 'Error logging in');
  }

  await ctx.reply('Logged in susccessfully!');
};

export default loginCommand;
