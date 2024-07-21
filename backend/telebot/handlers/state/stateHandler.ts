import { CustomContext } from '../../types/context.js';
import updateState from '../../util/inlineKeyboard/updateState.js';

const stateCallback = async (ctx: CustomContext) => {
  const args = ctx.callbackQuery?.data;

  if (!args) return;

  const callbackData = args.split('-')[1];

  const { state, swapState } = ctx.session;

  // console.log(ctx.session.swapState);
  ctx.session.page = 0;
  switch (state) {
    case 0:
      swapState.lessonType = callbackData;
      ctx.session.state = 1;
      break;
    case 1:
      swapState.current = callbackData;
      ctx.session.state = 2;
      break;
    case 2:
      swapState.request = callbackData;
      ctx.session.state = 3;
      break;
    default:
      break;
  }

  // console.log(ctx.session.state);
  await updateState(ctx);
  await ctx.answerCallbackQuery();
};

export default stateCallback;
