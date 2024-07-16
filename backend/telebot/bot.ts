import { Bot, session } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import env from '../util/validEnv.js';
import { createCallback, createCommand } from './handlers/createCommand.js';
import { CustomContext, SessionData } from './types/context.js';
import errorHandler from './middleware/errorHandler.js';
import loginCommand from './handlers/loginCommand.js';
import checkUserExists from './middleware/verifyUser.js';
import paginationCallback from './handlers/pagination.js';
import { backCallback, cancelCallback } from './handlers/stateNavigation.js';
import listCommand from './handlers/listCommand.js';

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
    },
    lessonsData: null,
    cache: new Map<string, InlineKeyboardButton.CallbackButton[][]>(),
  };
};

bot.use(session({ initial }));
bot.use(errorHandler);
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

bot.command('list', listCommand);

bot.command('create', async (ctx) => {
  await createCommand(ctx);
});

bot.command('login', async (ctx) => {
  await loginCommand(ctx);
});

bot.callbackQuery(/next-\d+/, paginationCallback(true));
bot.callbackQuery(/prev-\d+/, paginationCallback(false));
bot.callbackQuery('back', backCallback);
bot.callbackQuery('cancel', cancelCallback);
bot.callbackQuery(/^create-.*/, createCallback);
// bot.on('callback_query:data', (ctx) => createCallback(ctx));
// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Unrecgonised message!'));

export default bot;
