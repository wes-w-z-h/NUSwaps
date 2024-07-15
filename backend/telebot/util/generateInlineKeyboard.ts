import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import createHttpError from 'http-errors';
import { CustomContext, SessionData } from '../types/context.js';

/**
 * Function to generate the inline keyboard based on form state
 *
 * Data in inlineKeyboard is appended with -c as identifier to use callbackquery of create
 *
 * @param session - Tje current ctx session
 * @returns InlineKeyboard - The inline keyboard sent to the user
 */
export const generateInlineKeyboard = (
  session: SessionData
): InlineKeyboard => {
  const data = session.lessonsData;
  const { state, swapState } = session;

  const maxBtnsPerPage = 14;

  // function to slice the array according to max threshold
  // TODO: use a map or smth to cache the next page - see how
  const paginate = (entries: any[]) => {
    const start = session.page * maxBtnsPerPage;
    const end = start + maxBtnsPerPage;
    return entries.slice(start, end);
  };

  const rows: InlineKeyboardButton.CallbackButton[][] = [];
  let totalPages = 1;
  // function to create the rows
  const updateRows = (entries: string[]) => {
    // TODO: add condition so that the num per row fit nicely
    const btnsPerRow = 2;

    const btns = entries.map((s) => InlineKeyboard.text(s, `${s}-c`));
    // const truncatedBtns = paginateEntries(btns, session.page);
    for (let i = 0; i < btns.length; i += btnsPerRow) {
      rows.push(btns.slice(i, i + btnsPerRow));
    }
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
      totalPages = 1;
      break;
    }

    // back btn
    case 1: {
      const entries = data
        .filter((rl) => rl.lessonType === swapState.lessonType)
        .map((rl) => rl.classNo);
      updateRows(paginate(entries));
      // rows.push([InlineKeyboard.text('Back', 'back-c')]);
      totalPages = Math.ceil(entries.length / maxBtnsPerPage);
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
      updateRows(paginate(entries));
      // rows.push([InlineKeyboard.text('Back', 'back-c')]);
      totalPages = Math.ceil(entries.length / maxBtnsPerPage);
      break;
    }

    case 3: {
      rows.push([InlineKeyboard.text('Submit', 'submit-c')]);
      // rows.push([InlineKeyboard.text('Back', 'back-c')]);
      totalPages = 1;
      break;
    }

    default:
      break;
  }

  // add the nav buttons
  if (totalPages > 1) {
    if (session.page > 0 && session.page < totalPages - 1) {
      rows.push([
        InlineKeyboard.text('<<', `prev-${session.page}`),
        InlineKeyboard.text('>>', `next-${session.page}`),
      ]);
    } else if (session.page === totalPages - 1) {
      rows.push([InlineKeyboard.text('<<', `prev-${session.page}`)]);
    } else if (session.page === 0) {
      rows.push([InlineKeyboard.text('>>', `next-${session.page}`)]);
    }
  }
  if (session.state !== 0) {
    rows.push([
      InlineKeyboard.text('Back', 'back-c'),
      InlineKeyboard.text('Cancel', 'cancel-c'),
    ]);
  } else {
    rows.push([InlineKeyboard.text('Cancel', 'cancel-c')]);
  }
  return InlineKeyboard.from(rows);
};

export const handlePagination = async (ctx: CustomContext) => {
  const callbackData = ctx.callbackQuery?.data;
  if (!callbackData) {
    return;
  }

  if (callbackData.startsWith('next-')) {
    ctx.session.page += 1;
  } else if (callbackData.startsWith('prev-')) {
    ctx.session.page -= 1;
  } else {
    return;
  }

  const updatedKeyboard = generateInlineKeyboard(ctx.session);
  await ctx.editMessageReplyMarkup({ reply_markup: updatedKeyboard });
};
