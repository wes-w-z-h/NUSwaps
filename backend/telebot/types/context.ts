import { Context, SessionFlavor } from 'grammy';
import { Types } from 'mongoose';
import { InlineKeyboardButton } from 'grammy/types';
import { RawLesson } from '../../types/modules.js';

interface Swap {
  courseId: string;
  lessonType: string;
  current: string;
  request: string;
}

export interface SessionData {
  state: number;
  page: number;
  lessonsData: RawLesson[] | null;
  userId: Types.ObjectId | null;
  swapState: Swap;
  cache: Map<string, InlineKeyboardButton.CallbackButton[][]>;
}

export type CustomContext = Context & SessionFlavor<SessionData>;
