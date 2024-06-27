import { model, Schema } from 'mongoose';
import { ModuleCode } from '../types/modules.js';
import { ISwap, ISwapMethods, Swap, SwapPayload } from '../types/api.js';

const swapSchema = new Schema<ISwap, Swap, ISwapMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    courseId: {
      type: String,
      required: true,
      get: (v: string): ModuleCode => v as ModuleCode,
    },
    lessonType: {
      type: String,
      required: true,
    },
    current: {
      type: String,
      required: true,
    },
    request: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, toJSON: { getters: true } } // createdAt option
);

swapSchema.index(
  { userId: 1, courseId: 1, lessonType: 1, current: 1, request: 1 },
  { unique: true }
);

swapSchema.method('createResponse', function createReponse(): SwapPayload {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: this._id,
    userId: this.userId,
    courseId: this.courseId,
    lessonType: this.lessonType,
    current: this.current,
    request: this.request,
    status: this.status,
  };
});

const SwapModel = model<ISwap, Swap>('Swap', swapSchema);
export { SwapModel, swapSchema };
