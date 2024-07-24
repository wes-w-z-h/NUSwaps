import { Context, SessionFlavor } from 'grammy';
import { Types } from 'mongoose';
import { RawLesson } from '../../types/modules.js';

export interface Swap {
  id?: Types.ObjectId;
  courseId: string;
  lessonType: string;
  current: string;
  request: string;
  status: string;
}

export interface SessionData {
  state: number;
  page: number;
  lessonsData: RawLesson[];
  userId: Types.ObjectId | null;
  swapState: Swap;
  type: string;
}

export type CustomContext = Context & SessionFlavor<SessionData>;
