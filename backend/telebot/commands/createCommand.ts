import { CommandContext, InlineKeyboard } from 'grammy';
import createHttpError from 'http-errors';
import { InlineKeyboardButton } from 'grammy/types';
import { Module, RawLesson } from '../../types/modules.js';
import env from '../../util/validEnv.js';
import { SwapModel } from '../../models/swapModel.js';
import { getOptimalMatch } from '../../util/match/matchService.js';
import { CustomContext, SessionData } from '../types/context.js';
import { validateSwap } from '../../util/swap/validateSwap.js';

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
 * Async function to fetch the information for the specified courseId
 *
 * @param courseId - The ID of the course to fetch information for
 * @returns Promise<string[]> - A promise that resolves to an array of strings containing course information
 * @throws HttpError if the fetch operation fails
 */
const fetchData = async (courseId: string): Promise<RawLesson[]> => {
  const { NUS_MODS_BASE_API } = env;
  const resp = await fetch(`${NUS_MODS_BASE_API}/modules/${courseId}.json`);

  if (!resp.ok) {
    throw createHttpError(resp.status, 'Error occured fetching mod data');
  }

  const data: Module = await resp.json();

  return data.semesterData[0].timetable;
};

/**
 * Function to generate the inline keyboard based on form state
 *
 * Data in inlineKeyboard is appended with -c as identifier to use callbackquery of create
 *
 * @param state - A number representing state of creation of form
 * @param data - An array of strings from the fetchData function
 * @returns InlineKeyboard - The inline keyboard sent to the user
 */
const generateInlineKeyboard = (session: SessionData): InlineKeyboard => {
  const data = session.lessonsData;
  const { state, swapState } = session;
  const rows: InlineKeyboardButton.CallbackButton[][] = [];
  const updateRows = (entries: string[]) => {
    const btns = entries.map((s) => InlineKeyboard.text(s, `${s}-c`));
    for (let i = 0; i < btns.length; i += 1) {
      rows.push(btns.slice(i, i + 1));
    }
    rows.push([InlineKeyboard.text('Back', 'back-c')]);
  };

  if (!data) {
    throw createHttpError(404, 'Lesson data not found.');
  }
  // console.log(state);
  switch (state) {
    // select-lessontype
    case 0: {
      const lessontypes = new Set<string>();
      data
        .filter((rl) => rl.lessonType !== 'Lecture')
        .forEach((rl) => lessontypes.add(rl.lessonType));
      updateRows([...lessontypes]);
      break;
    }

    // back btn
    case 1: {
      const entries = data
        .filter((rl) => rl.lessonType === swapState.lessonType)
        .map((rl) => rl.classNo);
      updateRows(entries);
      break;
    }

    // back btn plus submit btn
    case 2: {
      const entries = data
        .filter(
          (rl) =>
            rl.lessonType === swapState.lessonType &&
            rl.classNo !== swapState.current
        )
        .map((rl) => rl.classNo);
      updateRows(entries);
      break;
    }

    case 3: {
      rows.push([InlineKeyboard.text('Submit', 'submit-c')]);
      rows.push([InlineKeyboard.text('back', 'back-c')]);
      break;
    }

    default:
      break;
  }
  return InlineKeyboard.from(rows);
};

/**
 * Callback query handler to process button presses
 *
 * @param ctx - Context sent from telegram
 */
export const createCallback = async (ctx: CustomContext) => {
  const args = ctx.callbackQuery?.data;

  if (!args) return;

  const callbackData = args.split('-')[0];

  const { state, swapState, userId } = ctx.session;
  if (callbackData === 'back') {
    ctx.session.state = state - 1 < 0 ? 0 : state - 1;
  } else if (callbackData === 'submit') {
    // console.log(swapState);
    if (!userId) {
      throw createHttpError(
        400,
        'User id is missing, please login first with /login'
      );
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
      throw createHttpError(400, 'Unable to create swap');
    }

    getOptimalMatch(data);
    await ctx.editMessageText(
      'Swap request submitted successfully!\n' +
        `Course id: ${data.courseId}\n${data.lessonType}\n` +
        `Current: ${data.current}\nRequest: ${data.request}`
    );
    return;
  } else {
    // console.log(ctx.session.swapState);
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
  }
  // console.log(swapState);
  try {
    const keyboard = generateInlineKeyboard(ctx.session);
    await ctx.editMessageText(
      `👇👇👇 ${STATES[ctx.session.state].split('-').join(' ')} from the list below 👇👇👇`,
      {
        reply_markup: keyboard,
      }
    );
    await ctx.answerCallbackQuery();
  } catch (error) {
    const err = error as Error;
    await ctx.answerCallbackQuery(err.message);
  }
};

/**
 * Handler function when the /create command is sent by user
 *
 * @param ctx - CustomContext sent from telegram
 */
export const createHandler = async (ctx: CommandContext<CustomContext>) => {
  const fullMessage = ctx.message?.text ?? '';
  const [, ...args] = fullMessage.trim().split(/\s+/); // Regex to split by whitespace
  ctx.session.state = 0;
  ctx.session.swapState = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
  };
  const HELP_TEXT =
    '❗️Please login before attempting to create a swap❗️\n' +
    'Use /login\n\n' +
    'Example usage: \n' +
    '/create cs2030s\n\n' +
    'For more info:\n' +
    '/create help';

  if (args.length !== 1) {
    await ctx.reply(HELP_TEXT);
    return;
  }

  if (args[0].toLowerCase() === 'help') {
    await ctx.reply(HELP_TEXT);
    return;
  }

  const { swapState, state } = ctx.session;
  const courseId = args[0].toUpperCase();
  // console.log(ctx.session.userId);

  ctx.session.lessonsData = await fetchData(courseId);
  swapState.courseId = courseId;

  const keyboard = generateInlineKeyboard(ctx.session);
  await ctx.reply(
    `👇👇👇 ${STATES[state].split('-').join(' ')} from the list below 👇👇👇`,
    {
      reply_markup: keyboard,
    }
  );
};
