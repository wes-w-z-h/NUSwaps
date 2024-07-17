import { CommandContext } from 'grammy';
import { SwapModel } from '../../models/swapModel.js';
import { getOptimalMatch } from '../../util/match/matchService.js';
import { CustomContext } from '../types/context.js';
import { validateSwap } from '../../util/swap/validateSwap.js';
import generateInlineKeyboard from '../util/generateInlineKeyboard.js';
import updateState from '../util/updateState.js';
import { packageSwap } from '../util/swapParser.js';
import fetchData from '../util/getModInfo.js';

/**
 * Array representation of the states of creating a swap
 *
 * select-lessontype | select-current | select-request
 */
const STATES = [
  'select-lessontype',
  'select-current',
  'select-request',
  'submit-swap',
];

/**
 * Callback query handler to process button presses
 *
 * @param ctx - Context sent from telegram
 */
export const createCallback = async (ctx: CustomContext) => {
  const args = ctx.callbackQuery?.data;

  if (!args) return;

  const callbackData = args.split('-')[1];

  const { state, swapState, userId } = ctx.session;

  if (callbackData === 'submit') {
    // console.log(swapState);
    if (!userId) {
      throw new Error('User id is missing, please login first with /login');
    }

    const { courseId, lessonType, current, request } = swapState;

    await validateSwap(
      userId.toString(),
      courseId,
      lessonType,
      current,
      request
    );

    const data = await SwapModel.create({
      userId,
      courseId,
      lessonType,
      current,
      request,
    });

    if (!data) {
      throw new Error('Unable to create swap');
    }

    // this can run async dont need to await
    getOptimalMatch(data);
    const swap = packageSwap(ctx.session.swapState, false).replace(/\+/g, '-');
    await ctx.editMessageText(`Swap request submitted successfully!\n${swap}`);
    await ctx.answerCallbackQuery();
    return;
  }
  // console.log(ctx.session.swapState);
  ctx.session.page = 0;
  switch (state) {
    case 0:
      swapState.lessonType = callbackData;
      ctx.session.state = 1;
      break;
    case 1:
      swapState.current = callbackData;
      ctx.session.state = 2;
      break;
    case 2:
      swapState.request = callbackData;
      ctx.session.state = 3;
      break;
    default:
      break;
  }

  console.log(ctx.session.state);
  await updateState(ctx, STATES);
  await ctx.answerCallbackQuery();
};

/**
 * Handler function when the /create command is sent by user
 *
 * @param ctx - CustomContext sent from telegram
 */
export const createCommand = async (ctx: CommandContext<CustomContext>) => {
  const fullMessage = ctx.message?.text ?? '';
  const [, ...args] = fullMessage.trim().split(/\s+/); // Regex to split by whitespace
  // reset session states
  ctx.session.cache.clear();
  ctx.session.state = 0;
  ctx.session.page = 0;
  ctx.session.swapState = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
  };
  ctx.session.type = 'create';
  const HELP_TEXT =
    '❗️Please login before attempting to create a swap❗️\n' +
    'Use /login\n\n' +
    'Example usage: \n' +
    '/create cs2030s\n\n' +
    'For more info:\n' +
    '/create help';

  if (args.length !== 1) {
    ctx.reply(HELP_TEXT);
    return;
  }

  if (args[0].toLowerCase() === 'help') {
    ctx.reply(HELP_TEXT);
    return;
  }

  const { swapState, state } = ctx.session;
  const courseId = args[0].toUpperCase();
  // console.log(ctx.session.userId);

  ctx.session.lessonsData = await fetchData(courseId);
  swapState.courseId = courseId;

  const keyboard = await generateInlineKeyboard(ctx.session);
  // TODO: change the reply to be more legit
  await ctx.reply(
    `👇👇👇 ${STATES[state].split('-').join(' ')} from the list below 👇👇👇`,
    {
      reply_markup: keyboard,
    }
  );
};
