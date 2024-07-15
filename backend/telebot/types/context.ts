import { Context, SessionFlavor } from 'grammy';
import { Types } from 'mongoose';
import { RawLesson } from '../../types/modules.js';

interface Swap {
  courseId: string;
  lessonType: string;
  current: string;
  request: string;
}

export interface SessionData {
  state: number;
  lessonsData: RawLesson[] | null;
  userId: Types.ObjectId | null;
  swapState: Swap;
}

export type CustomContext = Context & SessionFlavor<SessionData>;
