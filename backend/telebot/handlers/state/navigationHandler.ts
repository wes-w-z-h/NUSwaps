import { CustomContext } from '../../types/context.js';
import updateState from '../../util/inlineKeyboard/updateState.js';

export const backCallback = async (ctx: CustomContext) => {
  const { state, swapState } = ctx.session;
  switch (state) {
    case 0:
      ctx.session.type = 'update';
      ctx.session.state = -1;
      break;
    case 1:
      ctx.session.state = 0;
      swapState.lessonType = '';
      break;
    case 2:
      ctx.session.state = 1;
      swapState.current = '';
      break;
    case 3:
      ctx.session.state = 2;
      swapState.request = '';
      break;
    default:
      break;
  }

  await updateState(ctx);
  await ctx.answerCallbackQuery();
};

export const cancelCallback = async (ctx: CustomContext) => {
  await ctx.editMessageText('❌ Cancelled request!');
  await ctx.answerCallbackQuery({
    text: 'Request cancelled',
  });
};
