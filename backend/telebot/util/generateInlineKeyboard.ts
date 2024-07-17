import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import createHttpError from 'http-errors';
import { SessionData, Swap } from '../types/context.js';
import { createButtons } from './createButton.js';
import { SwapModel } from '../../models/swapModel.js';

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
  const data = session.lessonsData;
  const { state, swapState, cache, userId } = session;

  const maxBtnsPerPage = 14;
  // console.log(cache.keys());
  // gen the key for the current page
  const getKey = (): string => {
    return (
      `${session.state}-${session.swapState.lessonType}-` +
      `${session.swapState.current}-${session.page}`
    );
  };

  // function to slice the array according to max threshold
  const paginate = (entries: any[]) => {
    const start = session.page * maxBtnsPerPage;
    const end = start + maxBtnsPerPage;
    return entries.slice(start, end);
  };

  let rows: InlineKeyboardButton.CallbackButton[][] | undefined = [];
  let totalPages = 1;

  if (!data) {
    throw createHttpError(404, 'Lesson data not found.');
  }

  const cacheKey = getKey();
  if (cache.has(cacheKey)) {
    rows = cache.get(cacheKey);
  } else {
    switch (state) {
      case -1: {
        const swaps = await SwapModel.find({ userId });
        rows = createButtons(
          swaps.map((s) => {
            const swap: Swap = {
              id: s.id,
              courseId: s.courseId,
              lessonType: s.lessonType,
              current: s.current,
              request: s.request,
              status: s.status,
            };
            return swap;
          })
        );
        // TODO: change this
        totalPages = 1;
        break;
      }

      case 0: {
        const lessontypes = new Set<string>();
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
        rows = createButtons(paginate(entries));
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
        rows = createButtons(paginate(entries));
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

    if (totalPages > 1) {
      if (session.page > 0 && session.page < totalPages - 1) {
        rows.push([
          InlineKeyboard.text('<<', `prev-${session.page}`),
          InlineKeyboard.text('>>', `next-${session.page}`),
        ]);
      } else if (session.page === totalPages - 1) {
        rows.push([InlineKeyboard.text('<<', `prev-${session.page}`)]);
      } else {
        // if (session.page === 0) {
        rows.push([InlineKeyboard.text('>>', `next-${session.page}`)]);
      }
    }

    if (session.state === 0 && session.type === 'update') {
      rows.push([InlineKeyboard.text('Delete', 'update-delete')]);
    }

    if (
      session.state > 0 ||
      (session.type === 'update' && session.state !== -1)
    ) {
      rows.push([
        InlineKeyboard.text('Back', 'back'),
        InlineKeyboard.text('Cancel', 'cancel'),
      ]);
    } else {
      rows.push([InlineKeyboard.text('Cancel', 'cancel')]);
    }

    cache.set(cacheKey, rows);
  }

  return InlineKeyboard.from(rows || []);
};

export default generateInlineKeyboard;
