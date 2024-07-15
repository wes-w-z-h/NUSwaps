import { NextFunction } from 'grammy';
import { isHttpError } from 'http-errors';
import { CustomContext } from '../types/context.js';

const errorHandler = async (ctx: CustomContext, next: NextFunction) => {
  try {
    await next();
  } catch (error) {
    if (isHttpError(error)) {
      if (ctx.session.state === 0) {
        await ctx.reply(
          `Error occured (${error.statusCode}): ${error.name} - ${error.message}`
        );
        return;
      }
      await ctx.editMessageText(
        `Error occured (${error.statusCode}): ${error.name} - ${error.message}`
      );
    } else if (error instanceof Error) {
      if (ctx.session.state === 0) {
        await ctx.reply(`Error occured: ${error.name} - ${error.message}`);
        return;
      }
      await ctx.editMessageText(
        `Error occured: ${error.name} - ${error.message}`
      );
    } else {
      await ctx.editMessageText('Unknown error occured!');
    }
  }
};

export default errorHandler;
