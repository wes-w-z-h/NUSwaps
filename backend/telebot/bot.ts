import { Bot, session } from 'grammy';
import env from '../util/validEnv.js';
import { createCallback, createHandler } from './commands/createCommand.js';
import { CustomContext, SessionData } from './types/context.js';
import errorHandler from './middleware/errorHandler.js';
import loginHandler from './commands/loginCommand.js';
import checkUserExists from './middleware/verifyUser.js';
import { handlePagination } from './util/generateInlineKeyboard.js';

// Create an instance of the `Bot` class and pass your bot token to it.
const { BOT_TOKEN } = env;
const bot = new Bot<CustomContext>(BOT_TOKEN); // <-- put your bot token between the ""

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

bot.command('list', (ctx) => {
  ctx.reply('list swaps.');
});

bot.command('create', async (ctx) => {
  await createHandler(ctx);
});

bot.command('login', async (ctx) => {
  await loginHandler(ctx);
});

bot.callbackQuery(/next-\d+/, handlePagination);
bot.callbackQuery(/prev-\d+/, handlePagination);
// handler for mod related btns
bot.on('callback_query:data', (ctx) => createCallback(ctx));
// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Unrecgonised message!'));

export default bot;
