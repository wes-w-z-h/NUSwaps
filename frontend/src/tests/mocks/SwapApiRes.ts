import { Swap } from '../../types/Swap';
import { mockId } from './UserApiRes';

export const mockCourseId = 'CS1010X';
export const mockLessonType = 'Recitation';
export const mockCurrent = '1';
export const mockRequest = '2';

export const mockUnmatchedSwap: Swap = {
  id: '123',
  userId: mockId,
  courseId: mockCourseId,
  lessonType: mockLessonType,
  current: mockCurrent,
  request: mockRequest,
  status: 'UNMATCHED',
};

export const mockMatchedSwap: Swap = {
  id: '1234',
  userId: mockId,
  courseId: mockCourseId,
  lessonType: mockLessonType,
  current: mockCurrent,
  request: mockRequest,
  status: 'MATCHED',
};

export const mockConfirmedSwap: Swap = {
  id: '12345',
  userId: mockId,
  courseId: mockCourseId,
  lessonType: mockLessonType,
  current: mockCurrent,
  request: mockRequest,
  status: 'CONFIRMED',
};

export const mockSwapArr: Swap[] = [
  mockUnmatchedSwap,
  mockMatchedSwap,
  mockConfirmedSwap,
];
