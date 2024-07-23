import createHttpError from 'http-errors';
import { SwapModel } from '../../models/swapModel.js';
import { MatchModel } from '../../models/matchModel.js';
import { Module } from '../../types/modules.js';
import env from '../validEnv.js';

const isInNUSMods = async (
  courseId: string,
  lessonType: string,
  current: string,
  request: string
): Promise<void> => {
  const { NUS_MODS_BASE_API, SEMESTER } = env;
  const resp = await fetch(
    `${NUS_MODS_BASE_API}/modules/${courseId.toUpperCase()}.json`
  );

  // courseId doesnt exist in NUSMods api
  if (!resp.ok) {
    throw createHttpError(404, 'Course does not exist');
  }
  const data: Module = await resp.json();

  const lessons = data.semesterData[SEMESTER - 1].timetable;

  let currExists = false;
  let reqExists = false;
  let ltExists = false;
  for (let i = 0; i < lessons.length; i += 1) {
    const rl = lessons[i];
    if (!ltExists && rl.lessonType === lessonType) {
      ltExists = true;
    }
    if (!currExists && rl.lessonType === lessonType && rl.classNo === current) {
      currExists = true;
    }
    if (!reqExists && rl.lessonType === lessonType && rl.classNo === request) {
      reqExists = true;
    }
  }

  if (!ltExists) {
    throw createHttpError(400, 'Invalid lesson type');
  }

  if (!currExists) {
    throw createHttpError(400, 'Invalid lesson type + current slot');
  }

  if (!reqExists) {
    throw createHttpError(400, 'Invalid lesson type + request slot');
  }
};

// TODO: By right should throw a custom error if use this in the tele bot but laze
export const validateSwap = async (
  userId: string,
  courseId: string,
  lessonType: string,
  current: string,
  request: string,
  swapId?: string
) => {
  await isInNUSMods(courseId, lessonType, current, request);

  const existing = await SwapModel.find({
    userId,
    courseId,
    lessonType,
  }).exec();

  if (
    existing.length === 0 ||
    (existing.length === 1 && existing[0].id === swapId)
  ) {
    return;
  }

  if (existing[0].current !== current) {
    throw createHttpError(
      400,
      `Invalid current slot, differs from existing swap`
    );
  }

  const existing2 = await SwapModel.findOne({
    userId,
    courseId,
    lessonType,
    current,
    request,
  });

  if (existing2) {
    throw createHttpError(400, 'Duplicate swaps not allowed');
  }
};

export const validateMatchedStatus = async (id: string) => {
  // Verify valid swap
  const currSwap = await SwapModel.findById(id)
    .exec()
    .then((swap) => {
      if (!swap) {
        throw createHttpError(404, 'Swap not found');
      }

      if (swap.status !== 'MATCHED' || !swap.match) {
        throw createHttpError(400, 'Invalid request to confirm / reject swap');
      }

      return swap;
    });

  // Verify valid match
  await MatchModel.findById(currSwap.match)
    .exec()
    .then((match) => {
      if (match?.status !== 'PENDING') {
        throw createHttpError(400, 'Invalid request to confirm / reject swap');
      }
    });
};

export const validateUnmatchedStatus = async (id: string) => {
  await SwapModel.findById(id)
    .exec()
    .then((swap) => {
      if (!swap) {
        throw createHttpError(404, 'Swap not found');
      }

      if (swap.status !== 'UNMATCHED' || swap.match) {
        throw createHttpError(400, 'Invalid swap status');
      }
    });
};
