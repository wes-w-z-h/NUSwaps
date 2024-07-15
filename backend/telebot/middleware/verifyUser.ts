// middleware/checkUserExists.ts
import { CommandContext, NextFunction } from 'grammy';
import UserModel from '../../models/userModel.js';
import { CustomContext } from '../types/context.js';

const checkUserExists = async (
  ctx: CommandContext<CustomContext>,
  next: NextFunction
): Promise<void> => {
  // Skip middleware for /start and /help commands
  const userId = ctx.from?.id;
  if (
    ctx.message?.text?.startsWith('/start') ||
    ctx.message?.text?.startsWith('/help')
  ) {
    await next();
    return;
  }

  if (!userId) {
    await ctx.reply('User ID is missing.');
    return;
  }

  const userExists = await UserModel.findOne({ userId });

  if (!userExists) {
    await ctx.reply('User not found.');
    return;
  }

  ctx.session.userId = userExists.id;
  await next();
};

export default checkUserExists;
