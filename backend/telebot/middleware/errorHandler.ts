import { NextFunction } from 'grammy';
import { isHttpError } from 'http-errors';
import { CustomContext } from '../types/context.js';

const errorHandler = async (ctx: CustomContext, next: NextFunction) => {
  try {
    await next();
  } catch (error) {
    let errorMessage =
      error instanceof Error
        ? `${error.name} - ${error.message}`
        : 'Unknown error occurred!';

    if (isHttpError(error)) {
      errorMessage = `(${error.statusCode}): ${error.name} - ${error.message}`;
    }

    if (ctx.session.state === 0) {
      await ctx.reply(`Error occurred: ${errorMessage}`);
    } else {
      await ctx.editMessageText(`Error occurred: ${errorMessage}`);
    }
  }
};

export default errorHandler;
