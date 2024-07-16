import { CustomContext } from '../types/context.js';
import generateInlineKeyboard from './generateInlineKeyboard.js';

/**
 * Function to update the inline keyboard based on the current state
 *
 * @param ctx - CustomContext from telegram
 * @param states - Any array of possible states
 */
const updateState = (ctx: CustomContext, states: any[]) => {
  const keyboard = generateInlineKeyboard(ctx.session);
  ctx.editMessageText(
    `👇👇👇 ${states[ctx.session.state].split('-').join(' ')} from the list below 👇👇👇`,
    {
      reply_markup: keyboard,
    }
  );
};

export default updateState;
