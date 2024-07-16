import createHttpError from 'http-errors';
import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { CustomContext, Swap } from '../types/context.js';
import { SwapModel } from '../../models/swapModel.js';

const genText = (swap: Swap) => {
  return `${swap.courseId}-${swap.lessonType}-${swap.current}-${swap.request}`;
};

const createButtons = (data: Swap[]) => {
  const btnsPerRow = 1;
  const btns = data.map((s) => InlineKeyboard.text(genText(s), `update-${s}`));
  // create new object so they dont point to the same row
  const rows: InlineKeyboardButton.CallbackButton[][] = [];
  for (let i = 0; i < btns.length; i += btnsPerRow) {
    rows.push(btns.slice(i, i + btnsPerRow));
  }
  return rows;
};

const listCommand = async (ctx: CustomContext) => {
  const { userId } = ctx.session;
  if (!userId) {
    throw createHttpError(
      400,
      'User id is missing, please login first with /login'
    );
  }

  const HELP_TEXT =
    '❗️Please login before attempting to view all swaps❗️\n' +
    'Use /login\n\n' +
    'Example usage: \n' +
    '/list all \n\n' +
    'Add a course id to filter\n' +
    '/list cs1101s \n\n' +
    'For more info:\n' +
    '/create help';
  const fullMessage = ctx.message?.text ?? '';
  const [, ...args] = fullMessage.trim().split(/\s+/); // Regex to split by whitespace

  if (args.length !== 1) {
    ctx.reply(HELP_TEXT);
    return;
  }

  if (args[0].toLowerCase() === 'help') {
    ctx.reply(HELP_TEXT);
    return;
  }

  const data = await SwapModel.find({ userId: ctx.session.userId });
  const entries = data.map((s) => {
    const swap: Swap = {
      id: s.id,
      courseId: s.courseId,
      lessonType: s.lessonType,
      current: s.current,
      request: s.request,
    };
    return swap;
  });
  const btns = createButtons(entries);
  btns.push([InlineKeyboard.text('Close', 'cancel')]);
  const keyboard = InlineKeyboard.from(btns);
  const text = '📝Click on any request to edit it!';
  ctx.reply(text, {
    reply_markup: keyboard,
  });
};

export default listCommand;
