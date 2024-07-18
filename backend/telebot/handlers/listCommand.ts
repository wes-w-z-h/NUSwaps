import createHttpError from 'http-errors';
import { InlineKeyboard } from 'grammy';
import updateState from '../util/inlineKeyboard/updateState.js';
import { CustomContext, Swap } from '../types/context.js';
import { SwapModel } from '../../models/swapModel.js';
import { packageSwap, unpackSwap } from '../util/swapParser.js';
import { validateSwap } from '../../util/swap/validateSwap.js';
import { getOptimalMatch } from '../../util/match/matchService.js';
import fetchData from '../util/getModInfo.js';
import { createButtons } from '../util/inlineKeyboard/createButton.js';
import addNavButtons from '../util/inlineKeyboard/addNavButtons.js';

const STATES = [
  'select-lessontype',
  'select-current',
  'select-request',
  'submit-swap',
];

export const updateCallback = async (ctx: CustomContext) => {
  const args = ctx.callbackQuery?.data;

  if (!args) return;

  const callbackData = args.split('-')[1];
  // console.log(callbackData);
  const { state, swapState, userId } = ctx.session;
  ctx.session.page = 0;

  if (callbackData === 'delete') {
    if (!userId) {
      const err = new Error('User id is missing');
      err.name = 'NotFoundError';
      throw err;
    }

    const { id } = swapState;

    if (!id) {
      const err = new Error('Swap id is missing');
      err.name = 'NotFoundError';
      throw err;
    }

    if (!(await SwapModel.findByIdAndDelete(id))) {
      const err = new Error('Unable to delete swap');
      throw err;
    }

    await ctx.editMessageText('Swap request deleted successfull!');
    await ctx.answerCallbackQuery();
    return;
  }

  if (callbackData === 'submit') {
    if (!userId) {
      const err = new Error('User id is missing');
      err.name = 'NotFoundError';
      throw err;
    }

    const { courseId, lessonType, current, request, id } = swapState;
    // console.log(swapState);
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

  const { id, courseId, lessonType, current, request, status } = unpackSwap(
    callbackData,
    true
  );

  // TODO: add the handler for the different statuses
  if (status !== 'UNMATCHED') {
    const keyboard = new InlineKeyboard().url(
      'NUSwaps',
      'https://nuswaps.onrender.com' // the url cannot be localhost need to be publicly accessible
    );
    await ctx.editMessageText(
      `🎉 Your swap has been ${status.toLowerCase()}! 🎉\n\n` +
        'Visit the website here for further actions!',
      {
        reply_markup: keyboard,
      }
    );
    await ctx.answerCallbackQuery();
    return;
  }

  switch (state) {
    case -1: {
      ctx.session.swapState.id = id;
      ctx.session.lessonsData = await fetchData(courseId);
      swapState.courseId = courseId;
      swapState.status = status;
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
  ctx.session.type = 'update';
  ctx.session.state = -1;
  ctx.session.swapState = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
    status: '',
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
      status: s.status,
    };
    return swap;
  });

  const btns = createButtons(entries);
  addNavButtons(5, ctx.session, btns);
  const keyboard = InlineKeyboard.from(btns);
  const text = '📝 Click on any request to edit it!';
  await ctx.reply(text, {
    reply_markup: keyboard,
  });
};
