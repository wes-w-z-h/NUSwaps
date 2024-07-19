import { CustomContext } from '../../types/context.js';
import generateInlineKeyboard from '../../util/inlineKeyboard/generateInlineKeyboard.js';

export const paginationCallback = (next: boolean) => {
  return async (ctx: CustomContext) => {
    const callbackData = ctx.callbackQuery?.data;
    if (!callbackData) {
      await ctx.answerCallbackQuery();
      return;
    }

    ctx.session.page += next ? 1 : -1;

    const updatedKeyboard = await generateInlineKeyboard(ctx.session);
    await ctx.editMessageReplyMarkup({ reply_markup: updatedKeyboard });
    await ctx.answerCallbackQuery();
  };
};

// function to slice the array according to max threshold
export const paginate = (
  entries: any[],
  maxBtnsPerPage: number,
  page: number
) => {
  const start = page * maxBtnsPerPage;
  const end = start + maxBtnsPerPage;
  return entries.slice(start, end);
};
