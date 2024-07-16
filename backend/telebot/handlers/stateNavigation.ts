import { CustomContext } from '../types/context.js';
import updateState from '../util/updateState.js';

export const backCallback = async (ctx: CustomContext) => {
  const { state, swapState } = ctx.session;
  const STATES = [
    'select-lessontype',
    'select-current',
    'select-request',
    'submit-swap',
  ];

  switch (state) {
    case 0:
      ctx.session.state -= 1;
      break;
    case 1:
      ctx.session.state -= 1;
      swapState.lessonType = '';
      break;
    case 2:
      ctx.session.state -= 1;
      swapState.current = '';
      break;
    case 3:
      ctx.session.state -= 1;
      swapState.request = '';
      break;
    default:
      break;
  }

  await updateState(ctx, STATES);
  await ctx.answerCallbackQuery();
};

export const cancelCallback = async (ctx: CustomContext) => {
  ctx.editMessageText('❌ Cancelled request!');
  await ctx.answerCallbackQuery({
    text: 'Request cancelled',
  });
};
