import { Bot, GrammyError, HttpError, session } from 'grammy';
import { isHttpError } from 'http-errors';
import { limit } from '@grammyjs/ratelimiter';
import env from '../util/validEnv.js';
import { createCallback, createCommand } from './handlers/createCommand.js';
import { CustomContext, SessionData } from './types/context.js';
import loginCommand from './handlers/loginCommand.js';
import checkUserExists from './middleware/verifyUser.js';
import { paginationCallback } from './handlers/pagination.js';
import { backCallback, cancelCallback } from './handlers/stateNavigation.js';
import { listCommand, updateCallback } from './handlers/listCommand.js';

// Create an instance of the `Bot` class and pass your bot token to it.
const { BOT_TOKEN } = env;
const bot = new Bot<CustomContext>(BOT_TOKEN);

const initial = (): SessionData => {
  return {
    state: 0,
    page: 0,
    userId: null,
    swapState: {
      courseId: '',
      lessonType: '',
      current: '',
      request: '',
      status: '',
    },
    lessonsData: [],
    type: '',
  };
};

bot.use(session({ initial }));
// TODO: For now this suffices to prevent flooding of requests may need to find a btr way
bot.use(
  limit({
    timeFrame: 1377,
    limit: 1,
    onLimitExceeded: async (ctx) => {
      await ctx.reply('Please refrain from spamming clicks!');
    },
  })
);
bot.use(checkUserExists);

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('🟢 Welcome! Up and running! 🟢'));
bot.command('help', (ctx) =>
  ctx.reply(
    'Basic info: \n\n' +
      'To learn more about a command: /<command> help\n\n' +
      '/create - Create a new swap request eg. /create <course id>\n' +
      '/list - View all swap requests eg. /list all'
  )
);

const asyncWrapper = (f: (arg0: any) => any) => {
  return async (ctx: any) => {
    await f(ctx);
  };
};

bot.command('list', asyncWrapper(listCommand));
bot.command('create', asyncWrapper(createCommand));
bot.command('login', asyncWrapper(loginCommand));

// TODO: check if not awaiting callback leads to unpreictable behavior
bot.callbackQuery(/next-\d+/, paginationCallback(true));
bot.callbackQuery(/prev-\d+/, paginationCallback(false));
bot.callbackQuery('back', backCallback);
bot.callbackQuery('cancel', cancelCallback);
bot.callbackQuery(/^create-.*/, createCallback);
bot.callbackQuery(/^update-.*/, updateCallback);
// bot.on('callback_query:data', (ctx) => createCallback(ctx));
// Handle other messages.
bot.on('message', (ctx) => {
  ctx.reply('Unrecgonised message!');
});

// Global error handler
bot.catch(async (err) => {
  const { ctx } = err;
  const e = err.error;

  const getErrorMessage = (error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof GrammyError) {
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
    await ctx.reply(message);
  };

  await handleReplyOrEdit(ctx.session, msg);
});

export default bot;
