import createHttpError from 'http-errors';
import { RawLesson, Module } from '../../types/modules.js';
import env from '../../util/validEnv.js';

/**
 * Async function to fetch the information for the specified courseId
 *
 * @param courseId - The ID of the course to fetch information for
 * @returns Promise<string[]> - A promise that resolves to an array of strings containing course information
 * @throws HttpError if the fetch operation fails
 */
const fetchData = async (courseId: string): Promise<RawLesson[]> => {
  const { NUS_MODS_BASE_API, SEMESTER } = env;
  const resp = await fetch(`${NUS_MODS_BASE_API}/modules/${courseId}.json`);

  if (!resp.ok) {
    throw createHttpError(resp.status, 'Error occured fetching mod data');
  }

  const data: Module = await resp.json();
  // console.log(data.semesterData[0].timetable);

  return data.semesterData[SEMESTER - 1].timetable;
};

export default fetchData;
