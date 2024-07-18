import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { SessionData, Swap } from '../../types/context.js';
import { createButtons } from './createButton.js';
import { SwapModel } from '../../../models/swapModel.js';
import { paginate } from '../../handlers/pagination.js';
import addNavButtons from './addNavButtons.js';

/**
 * Function to generate the inline keyboard based on form state
 *
 * Data in inlineKeyboard is appended with -c as identifier to use callbackquery of create
 *
 * @param session - The current ctx session
 * @returns InlineKeyboard - The inline keyboard sent to the user
 */
const generateInlineKeyboard = async (
  session: SessionData
): Promise<InlineKeyboard> => {
  const { state, swapState, userId, lessonsData } = session;
  const data = lessonsData;
  const maxBtnsPerPage = 14;

  let rows: InlineKeyboardButton.CallbackButton[][] = [];
  let totalPages = 1;

  if (!data) {
    if (state !== -1) throw new Error('Lesson data not found.');
  }

  switch (state) {
    case -1: {
      const swaps = await SwapModel.find({ userId });
      const swapList = swaps.map((s) => {
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
      rows = createButtons(paginate(swapList, 5, session.page));
      totalPages = Math.ceil(swapList.length / 5);
      break;
    }

    case 0: {
      const lessontypes = new Set<string>();
      // console.log(data.length);
      data
        .filter((rl) => rl.lessonType !== 'Lecture')
        .forEach((rl) => lessontypes.add(rl.lessonType));
      rows = createButtons([...lessontypes]);
      totalPages = 1;
      break;
    }

    case 1: {
      const entries = data
        .filter((rl) => rl.lessonType === swapState.lessonType)
        .map((rl) => rl.classNo);
      // console.info(entries.length);
      rows = createButtons(paginate(entries, maxBtnsPerPage, session.page));
      totalPages = Math.ceil(entries.length / maxBtnsPerPage);
      break;
    }

    case 2: {
      const entries = data
        .filter(
          (rl) =>
            rl.lessonType === swapState.lessonType &&
            rl.classNo !== swapState.current
        )
        .map((rl) => rl.classNo);
      rows = createButtons(paginate(entries, maxBtnsPerPage, session.page));
      totalPages = Math.ceil(entries.length / maxBtnsPerPage);
      break;
    }

    case 3: {
      rows.push([InlineKeyboard.text('Submit', `${session.type}-submit`)]);
      totalPages = 1;
      break;
    }

    default:
      break;
  }

  addNavButtons(totalPages, session, rows);
  return InlineKeyboard.from(rows || []);
};

export default generateInlineKeyboard;
