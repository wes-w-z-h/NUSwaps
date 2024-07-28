import { Types } from 'mongoose';
import { Swap } from '../../types/context.js';

const STATUSTOEMOJI = new Map<string, string>();
STATUSTOEMOJI.set('UNMATCHED', '👀');
STATUSTOEMOJI.set('MATCHED', '🔔');
STATUSTOEMOJI.set('CONFIRMED', '🟠');
STATUSTOEMOJI.set('COMPLETED', '✅');

const EMOJITOSTATUS = new Map<string, string>();
EMOJITOSTATUS.set('👀', 'UNMATCHED');
EMOJITOSTATUS.set('🔔', 'MATCHED');
EMOJITOSTATUS.set('🟠', 'CONFIRMED');
EMOJITOSTATUS.set('✅', 'COMPLETED');

export const packageSwap = (swap: Swap, includeId: boolean): string => {
  const swapStr = `${swap.courseId}+${swap.lessonType.slice(0, 3)}+${swap.current}+${swap.request}+${STATUSTOEMOJI.get(swap.status)}`;
  return swap.id && includeId ? `${swapStr}+${swap.id}` : swapStr;
};

export const unpackSwap = (swapPkg: string, includeId: boolean) => {
  const args = swapPkg.split('+');
  // console.log(args);
  const swap: Swap = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
    status: '',
  };

  if (args.length < 5 || args.length > 6) {
    throw Error('Invalid swap string to unpack!');
  }
  const [courseId, lessonType, current, request, status, id] = args;

  // console.log(status, EMOJITOSTATUS.get(status));

  swap.courseId = courseId;
  swap.lessonType = lessonType;
  swap.current = current;
  swap.request = request;
  if (EMOJITOSTATUS.get(status)) {
    const x: string | undefined = EMOJITOSTATUS.get(status);
    if (x) swap.status = x;
  }

  if (includeId && args.length === 6) {
    swap.id = id as unknown as Types.ObjectId;
  }

  return swap;
};
