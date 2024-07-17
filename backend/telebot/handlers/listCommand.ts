import createHttpError from 'http-errors';
import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { CustomContext, Swap } from '../types/context.js';
import { SwapModel } from '../../models/swapModel.js';
import { packageSwap, unpackSwap } from '../util/swapParser.js';
import { validateSwap } from '../../util/swap/validateSwap.js';
import { getOptimalMatch } from '../../util/match/matchService.js';
import updateState from '../util/updateState.js';
import fetchData from '../util/getModInfo.js';

const STATES = [
  'select-lessontype',
  'select-current',
  'select-request',
  'submit-swap',
];

const createButtons = (data: Swap[]) => {
  const btnsPerRow = 1;
  const btns = data.map((s) => {
    return InlineKeyboard.text(
      packageSwap(s, false).replace(/\+/g, '-'),
      `update-${packageSwap(s, true)}`
    );
  });
  // create new object so they dont point to the same row
  const rows: InlineKeyboardButton.CallbackButton[][] = [];
  for (let i = 0; i < btns.length; i += btnsPerRow) {
    rows.push(btns.slice(i, i + btnsPerRow));
  }
  return rows;
};

export const updateCallback = async (ctx: CustomContext) => {
  const args = ctx.callbackQuery?.data;

  if (!args) return;

  const callbackData = args.split('-')[1];
  // console.log(callbackData);
  const { state, swapState, userId } = ctx.session;
  ctx.session.page = 0;

  if (callbackData === 'submit') {
    if (!userId) {
      const err = new Error('User id is missing');
      err.name = 'NotFoundError';
      throw err;
    }

    const { courseId, lessonType, current, request, id } = swapState;

    if (!id) {
      const err = new Error('Swap id is missing');
      err.name = 'NotFoundError';
      throw err;
    }

    // console.log('callback id', id.toString());

    await validateSwap(
      userId.toString(),
      courseId,
      lessonType,
      current,
      request,
      id.toString()
    );

    const data = await SwapModel.findByIdAndUpdate(swapState.id, {
      userId,
      courseId,
      lessonType,
      current,
      request,
    });

    if (!data) {
      throw createHttpError(400, 'Unable to update swap');
    }

    getOptimalMatch(data);
    const swap = packageSwap(ctx.session.swapState, false).replace(/\+/g, '-');
    await ctx.editMessageText(`Swap request updated successfully!\n${swap}`);
    await ctx.answerCallbackQuery();
    return;
  }

  const { id, courseId, lessonType, current, request } = unpackSwap(
    callbackData,
    true
  );

  switch (state) {
    case -1: {
      ctx.session.swapState.id = id;
      ctx.session.lessonsData = await fetchData(courseId);
      ctx.session.cache.clear();
      swapState.courseId = courseId;
      ctx.session.state = 0;
      break;
    }
    case 0: {
      swapState.lessonType = lessonType;
      ctx.session.state = 1;
      break;
    }
    case 1:
      swapState.current = current;
      ctx.session.state = 2;
      break;
    case 2:
      swapState.request = request;
      ctx.session.state = 3;
      break;
    default:
      break;
  }

  await updateState(ctx, STATES);
  await ctx.answerCallbackQuery();
};

export const listCommand = async (ctx: CustomContext) => {
  const fullMessage = ctx.message?.text ?? '';
  const [, ...args] = fullMessage.trim().split(/\s+/); // Regex to split by whitespace

  // reset session states
  ctx.session.page = 0;
  ctx.session.cache.clear();
  ctx.session.type = 'update';
  ctx.session.state = -1;
  ctx.session.swapState = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
  };

  const HELP_TEXT =
    '❗️Please login before attempting to view all swaps❗️\n' +
    'Use /login\n\n' +
    'Example usage: \n' +
    '/list all \n\n' +
    'Add a course id to filter\n' +
    '/list cs1101s \n\n' +
    'For more info:\n' +
    '/create help';

  if (args.length !== 1) {
    ctx.reply(HELP_TEXT);
    return;
  }

  let data = [];
  if (args[0].toLowerCase() === 'help') {
    ctx.reply(HELP_TEXT);
    return;
  }

  if (args[0].toLowerCase() === 'all') {
    data = await SwapModel.find({ userId: ctx.session.userId });
  } else {
    data = await SwapModel.find({
      userId: ctx.session.userId,
      courseId: args[0].toUpperCase(),
    });
  }

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
  const text = '📝 Click on any request to edit it!';
  await ctx.reply(text, {
    reply_markup: keyboard,
  });
};
