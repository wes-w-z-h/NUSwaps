import { Bot, session } from 'grammy';
import { limit } from '@grammyjs/ratelimiter';
import env from '../util/validEnv.js';
import { createCallback, createCommand } from './handlers/createCommand.js';
import { CustomContext, SessionData } from './types/context.js';
import loginCommand from './handlers/loginCommand.js';
import checkUserExists from './middleware/verifyUser.js';
import { paginationCallback } from './handlers/state/paginationHandler.js';
import {
  backCallback,
  cancelCallback,
} from './handlers/state/navigationHandler.js';
import { listCommand, updateCallback } from './handlers/listCommand.js';
import matchCallback from './handlers/matchCallback.js';
import errorHandler from './util/errorHandler.js';
import stateCallback from './handlers/state/stateHandler.js';

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
    timeFrame: 1277,
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
      '/list - View all swap requests eg. /list all\n' +
      'Click on any of the swaps to edit them and perform further actions!'
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
bot.callbackQuery(/^state-.*/, stateCallback);
bot.callbackQuery(/^update-.*/, updateCallback);
bot.callbackQuery(/^match-.*/, matchCallback);

bot.on('message', (ctx) => {
  ctx.reply('Unrecgonised message!');
});

// Global error handler
bot.catch(errorHandler);

export default bot;
