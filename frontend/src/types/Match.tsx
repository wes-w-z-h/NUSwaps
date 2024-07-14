export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type Match = {
  id: string;
  courseId: string;
  lessonType: string;
  status: MatchStatus;
  swaps: [string];
};
