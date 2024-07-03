export type SwapStatus = 'UNMATCHED' | 'MATCHED' | 'CONFIRMED' | 'COMPLETED';

export type Swap = {
  id: string;
  userId: string;
  courseId: string;
  lessonType: string;
  current: string;
  request: string;
  status: SwapStatus;
};
