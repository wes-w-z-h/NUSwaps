import { Types } from 'mongoose';
import { ModuleCode } from './modules.js';

export type User = {
  readonly _id: Types.ObjectId;
  username: string;
  password: string;
  swapRequests: Swap[];
  createdAt: Date;
  updatedAt: Date;
  __v: string;
  readonly id: Types.ObjectId;
};

export type Swap = Readonly<{
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: ModuleCode;
  lessonType: string;
  current: string;
  request: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: string;
  id: Types.ObjectId;
}>;
