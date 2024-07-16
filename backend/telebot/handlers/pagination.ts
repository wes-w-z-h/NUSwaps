import { CustomContext } from '../types/context.js';
import generateInlineKeyboard from '../util/generateInlineKeyboard.js';

const paginationCallback = (next: boolean) => {
  return async (ctx: CustomContext) => {
    const callbackData = ctx.callbackQuery?.data;
    if (!callbackData) {
      await ctx.answerCallbackQuery();
      return;
    }

    ctx.session.page += next ? 1 : -1;

    const updatedKeyboard = await generateInlineKeyboard(ctx.session);
    ctx.editMessageReplyMarkup({ reply_markup: updatedKeyboard });
    await ctx.answerCallbackQuery();
  };
};

export default paginationCallback;
