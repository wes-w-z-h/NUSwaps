import { MatchModel } from '../../models/matchModel.js';
import { SwapModel } from '../../models/swapModel.js';
import { rejectMatch } from '../../util/match/matchService.js';
import { validateMatchedStatus } from '../../util/swap/validateSwap.js';
import { CustomContext } from '../types/context.js';

const matchCallback = async (ctx: CustomContext) => {
  const args = ctx.callbackQuery?.data;

  if (!args) return;

  const callbackData = args.split('-')[1];
  const { id } = ctx.session.swapState;
  switch (callbackData) {
    case 'confirm':
      {
        await validateMatchedStatus(
          // conversion from objectId to string
          id as unknown as string
        );
        const confirmedSwap = await SwapModel.findByIdAndUpdate(
          id,
          {
            status: 'CONFIRMED',
          },
          {
            runValidators: true,
            new: true,
          }
        ).exec();

        if (!confirmedSwap) {
          const err = new Error('Unable to confirm swap');
          err.name = 'BadRequestError';
          throw err;
        }

        const match = await MatchModel.findById(confirmedSwap.match).exec();
        if (!match) {
          throw new Error('Match not found');
        }

        const newStatus = await match.getNewStatus();

        await MatchModel.findByIdAndUpdate(confirmedSwap.match, {
          status: newStatus,
        }).exec();
      }
      await ctx.editMessageText(
        '👍 Confirmed match, awaiting reposnse from partner!'
      );
      break;
    case 'reject':
      {
        console.log(id);
        await validateMatchedStatus(id as unknown as string);

        let rejectedSwap = await SwapModel.findById(id).exec();
        if (!rejectedSwap) {
          throw new Error('Swap not found');
        }

        await rejectMatch(rejectedSwap);

        rejectedSwap = await SwapModel.findByIdAndUpdate(
          id,
          { status: 'UNMATCHED', match: null },
          {
            runValidators: true,
            new: true,
          }
        ).exec();

        if (!rejectedSwap) {
          throw new Error('Unable to reject swap');
        }
      }
      await ctx.editMessageText(
        '😓 Rejected match, searching for new match ASAP!'
      );
      break;
    default:
      break;
  }
  await ctx.answerCallbackQuery();
};

export default matchCallback;
