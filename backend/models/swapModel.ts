import { model, Schema } from 'mongoose';
import { RawLesson, ModuleCode } from '../types/modules.js';
import { ISwap, ISwapMethods, Swap } from '../types/api.js';

function courseSetter(lesson: RawLesson): string {
  return `${lesson.lessonType}-${lesson.classNo}`;
}

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
      set: courseSetter,
    },
    request: {
      type: String,
      required: true,
      set: courseSetter,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, toJSON: { getters: true } } // createdAt option
);

swapSchema.method('createResponse', function createReponse() {
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
