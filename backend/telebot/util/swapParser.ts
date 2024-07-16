import { Types } from 'mongoose';
import { Swap } from '../types/context.js';

export const packageSwap = (swap: Swap, includeId: boolean): string => {
  const swapStr = `${swap.courseId}+${swap.lessonType}+${swap.current}+${swap.request}`;
  return swap.id && includeId ? `${swapStr}+${swap.id}` : swapStr;
};

export const unpackSwap = (swapPkg: string, includeId: boolean) => {
  const args = swapPkg.split('+');
  console.log(args);
  const swap: Swap = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
  };
  if (args.length < 4 || args.length > 5) {
    throw Error('Invalid swap string to unpack!');
  }
  const [courseId, lessonType, current, request, id] = args;

  swap.courseId = courseId;
  swap.lessonType = lessonType;
  swap.current = current;
  swap.request = request;

  if (includeId && args.length === 5) {
    // TODO: test this make sure conversion legit
    swap.id = id as unknown as Types.ObjectId;
  }

  return swap;
};
