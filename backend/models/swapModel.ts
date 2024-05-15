import { Types, model, Schema } from 'mongoose';
import { RawLesson, ModuleCode } from '../types/modules.js';

function courseSetter(lesson: RawLesson): string {
  return `${lesson.lessonType}-${lesson.classNo}`;
}

const swapSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
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

const SwapModel = model('Swap', swapSchema);
export { SwapModel, swapSchema };
