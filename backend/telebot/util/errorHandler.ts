import { BotError, GrammyError, HttpError } from 'grammy';
import { isHttpError } from 'http-errors';
import { CustomContext, SessionData } from '../types/context.js';

const errorHandler = async (err: BotError<CustomContext>) => {
  const { ctx } = err;
  const e = err.error;

  const getErrorMessage = (error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof GrammyError) {
      if (error.method === 'editMessageText') {
        return '';
      }
      return `Error in request: ${error.description}`;
    }
    if (error instanceof HttpError) {
      return `Could not contact Telegram: ${error}`;
    }
    if (isHttpError(error)) {
      return `Error occurred: ${error.name} - ${error.message}`;
    }
    return `Unknown error: ${error}`;
  };

  const msg = getErrorMessage(e);

  const handleReplyOrEdit = async (
    curr_session: SessionData,
    message: string
  ) => {
    // TODO: if theres time find a way to edit or reply msgs properly these methods throw an error
    // dangerous when this is the only error handler
    // if (curr_session.type === 'create' && curr_session.state === 0) {
    //   await ctx.reply(message);
    // } else if (curr_session.type === 'update' && curr_session.state === -1) {
    //   await ctx.reply(message);
    // } else {
    //   await ctx.editMessageText(message);
    // }
    if (msg) {
      await ctx.reply(message);
    }
  };

  await handleReplyOrEdit(ctx.session, msg);
};

export default errorHandler;
