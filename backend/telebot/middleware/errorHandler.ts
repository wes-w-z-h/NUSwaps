import { NextFunction } from 'grammy';
import { isHttpError } from 'http-errors';
import { CustomContext } from '../types/context.js';

const errorHandler = async (ctx: CustomContext, next: NextFunction) => {
  try {
    await next();
  } catch (error) {
    if (isHttpError(error)) {
      await ctx.reply(
        `Error occured (${error.statusCode}): ${error.name} - ${error.message}`
      );
    } else if (error instanceof Error) {
      await ctx.reply(`Error occures: ${error.name} - ${error.message}`);
    } else {
      await ctx.reply('Unknown error occured!');
    }
  }
};

export default errorHandler;
