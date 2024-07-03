import { model, Schema } from 'mongoose';
import { ModuleCode } from '../types/modules.js';
import { IMatch, IMatchMethods, Match, MatchStatus } from '../types/api.js';
import { SwapModel } from './swapModel.js';

const matchSchema = new Schema<IMatch, Match, IMatchMethods>(
  {
    swaps: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Swap',
        required: true,
        immutable: true,
      },
    ],
    courseId: {
      type: String,
      required: true,
      get: (v: string): ModuleCode => v as ModuleCode,
    },
    lessonType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'PENDING',
    },
  },
  { timestamps: true, toJSON: { getters: true } } // createdAt option
);

matchSchema.method(
  'getNewStatus',
  async function getNewStatus(): Promise<MatchStatus> {
    const { swaps } = this;
    let isAccepted = true;

    // eslint-disable-next-line no-restricted-syntax
    for await (const swapId of swaps) {
      const swap = await SwapModel.findById(swapId);
      if (swap?.status === 'UNMATCHED') {
        return Promise.resolve('REJECTED');
      }
      if (swap?.status === 'MATCHED') {
        isAccepted = false;
      }
    }

    if (isAccepted) {
      return Promise.resolve('ACCEPTED');
    }
    return Promise.resolve('PENDING');
  }
);

const MatchModel = model<IMatch, Match>('Match', matchSchema);
export { MatchModel, matchSchema };
