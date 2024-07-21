import { CommandContext } from 'grammy';
import { SwapModel } from '../../models/swapModel.js';
import { getOptimalMatch } from '../../util/match/matchService.js';
import { CustomContext } from '../types/context.js';
import { validateSwap } from '../../util/swap/validateSwap.js';
import generateInlineKeyboard from '../util/inlineKeyboard/generateInlineKeyboard.js';
import updateState from '../util/inlineKeyboard/updateState.js';
import { packageSwap } from '../util/swaps/swapParser.js';
import fetchData from '../util/getModInfo.js';
import swapToString from '../util/swaps/swapToString.js';

/**
 * Callback query handler to process button presses
 *
 * @param ctx - Context sent from telegram
 */
export const createCallback = async (ctx: CustomContext) => {
  const args = ctx.callbackQuery?.data;

  if (!args) return;

  const callbackData = args.split('-')[1];

  const { swapState, userId } = ctx.session;

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
    await ctx.editMessageText(`Swap request created successfully!\n${swap}`);
    await ctx.answerCallbackQuery();
    return;
  }

  // console.log(ctx.session.state);
  await updateState(ctx);
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
  ctx.session.state = 0;
  ctx.session.page = 0;
  ctx.session.swapState = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
    status: 'UNMATCHED',
  };
  ctx.session.type = 'create';
  const helpText =
    '💡 Basic info for /create:\n\n' +
    'Example usage: \n' +
    '/create cs2030s\n\n' +
    'For more info:\n' +
    '/create help';

  if (args.length !== 1) {
    ctx.reply(helpText);
    return;
  }

  if (args[0].toLowerCase() === 'help') {
    ctx.reply(helpText);
    return;
  }

  const { swapState } = ctx.session;
  const courseId = args[0].toUpperCase();
  // console.log(ctx.session.userId);

  ctx.session.lessonsData = await fetchData(courseId);
  swapState.courseId = courseId;

  const keyboard = await generateInlineKeyboard(ctx.session);
  await ctx.reply(
    `${swapToString(ctx.session.swapState)}\n\n` +
      `👇 Select lesson type from the list below 👇`,
    {
      reply_markup: keyboard,
    }
  );
};
