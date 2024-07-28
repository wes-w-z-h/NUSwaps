import { CustomContext } from '../../types/context.js';
import generateInlineKeyboard from './generateInlineKeyboard.js';
import swapToString from '../swaps/swapToString.js';

const stateToString = (state: number) => {
  if (state === 0) return 'lesson type';
  if (state === 1) return 'current';
  if (state === 2) return 'request';
  return '';
};

/**
 * Function to update the inline keyboard based on the current state
 *
 * @param ctx - CustomContext from telegram
 */
const updateState = async (ctx: CustomContext) => {
  const keyboard = await generateInlineKeyboard(ctx.session);
  if (ctx.session.state !== -1) {
    await ctx.editMessageText(
      `${swapToString(ctx.session.swapState)}\n\n` +
        `👇 Select ${stateToString(ctx.session.state)} from the list below 👇`,
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
