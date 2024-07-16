import createHttpError from 'http-errors';
import { SwapModel } from '../../models/swapModel.js';
import { getOptimalMatch } from '../../util/match/matchService.js';
import { validateSwap } from '../../util/swap/validateSwap.js';
import { CustomContext } from '../types/context.js';
import { packageSwap } from '../util/swapParser.js';

// console.log(swapState)
const submitCallback = async (ctx: CustomContext) => {
  const { swapState, userId } = ctx.session;

  if (!userId) {
    throw createHttpError(
      401,
      'User id is missing, please login first with /login'
    );
  }

  const { courseId, lessonType, current, request } = swapState;

  await validateSwap(userId.toString(), courseId, lessonType, current, request);

  const data = await SwapModel.create({
    userId,
    courseId,
    lessonType,
    current,
    request,
  });

  if (!data) {
    throw createHttpError(400, 'Unable to create swap');
  }

  // this can run async dont need to await
  getOptimalMatch(data);
  const swap = packageSwap(ctx.session.swapState, false);
  ctx.editMessageText(`Swap request submitted successfully!\n${swap}`);
  await ctx.answerCallbackQuery();
};

export default submitCallback;
