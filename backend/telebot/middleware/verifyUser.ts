// middleware/checkUserExists.ts
import { NextFunction } from 'grammy';
import UserModel from '../../models/userModel.js';
import { CustomContext } from '../types/context.js';

const checkUserExists = async (
  ctx: CustomContext,
  next: NextFunction
): Promise<void> => {
  if (ctx.session.userId) {
    await next();
    return;
  }
  // Skip middleware for /start and /help commands
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply('User ID is missing.');
    return;
  }

  if (
    ctx.message?.text?.startsWith('/start') ||
    ctx.message?.text?.startsWith('/help') ||
    ctx.message?.text?.startsWith('/login')
  ) {
    await next();
    return;
  }

  const userExists = await UserModel.findOne({ telegramId: userId });

  if (!userExists) {
    await ctx.reply('User not found.');
    return;
  }

  ctx.session.userId = userExists.id;
  await next();
};

export default checkUserExists;
