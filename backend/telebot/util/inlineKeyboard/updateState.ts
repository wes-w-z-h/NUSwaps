import { CustomContext } from '../../types/context.js';
import generateInlineKeyboard from './generateInlineKeyboard.js';

/**
 * Function to update the inline keyboard based on the current state
 *
 * @param ctx - CustomContext from telegram
 * @param states - Any array of possible states
 */
const updateState = async (ctx: CustomContext, states: any[]) => {
  const keyboard = await generateInlineKeyboard(ctx.session);
  if (ctx.session.state !== -1) {
    await ctx.editMessageText(
      `👇👇👇 ${states[ctx.session.state].split('-').join(' ')} from the list below 👇👇👇`,
      {
        reply_markup: keyboard,
      }
    );
  } else {
    const text = '📝 Click on any request to edit it!';
    await ctx.editMessageText(text, {
      reply_markup: keyboard,
    });
  }
};

export default updateState;
