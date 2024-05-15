import { Types } from 'mongoose';
import { ModuleCode, RawLesson } from './modules';

export type User = {
  readonly _id: Types.ObjectId;
  username: string;
  password: string;
  swapRequests: Swap[];
  timestamps: Date;
};

export type Swap = Readonly<{
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: ModuleCode;
  current: RawLesson;
  request: RawLesson;
  status: boolean;
  timestamps: Date;
}>;
