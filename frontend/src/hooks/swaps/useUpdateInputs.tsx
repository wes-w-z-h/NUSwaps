import React, { SetStateAction, useEffect } from 'react';
import { Module } from '../../types/modules';

const useUpdateInputs = (
  states: {
    mod: Module | null;
    lessonType: string;
    current: string;
    currentOptions: string[];
    request: string;
    requestOptions: string[];
  },
  setters: {
    setLessonTypes: React.Dispatch<SetStateAction<string[]>>;
    setLessonType: React.Dispatch<SetStateAction<string>>;
    setCurrent: React.Dispatch<SetStateAction<string>>;
    setRequest: React.Dispatch<SetStateAction<string>>;
    setCurrentOptions: React.Dispatch<SetStateAction<string[]>>;
    setRequestOptions: React.Dispatch<SetStateAction<string[]>>;
  }
) => {
  const { mod, lessonType, current, currentOptions, request, requestOptions } =
    states;
  const {
    setLessonTypes,
    setLessonType,
    setCurrent,
    setRequest,
    setCurrentOptions,
    setRequestOptions,
  } = setters;
  // when the mod changes -> change the lessonType
  useEffect(() => {
    if (mod) {
      console.log('mod effect');
      const lts = mod.semesterData[0].timetable
        .map((v) => v.lessonType)
        .filter((v) => v !== 'Lecture');
      // console.log(mod.semesterData[0].timetable.map((v) => v.lessonType));
      const s: Set<string> = new Set();
      lts.forEach((v) => s.add(v));
      setLessonTypes([...s]);
      setLessonType(lts[0] ? lts[0] : '-');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod]);

  // when the lessonType changes -> change the current and request
  useEffect(() => {
    console.log('lessonType effect');
    if (mod) {
      const options = mod?.semesterData[0].timetable
        .filter((v) => v.lessonType === lessonType)
        .map((v) => v.classNo);

      const firstOption = options[0] || '-';
      setCurrentOptions(options);
      setRequestOptions(options);
      setCurrent(firstOption);
      setRequest(firstOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonType, mod]);

  // when the current/ options changes -> change the requestOptions
  useEffect(() => {
    console.log('current effect');
    if (currentOptions) {
      setRequestOptions(currentOptions.filter((v) => v !== current));
    } else setRequestOptions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, currentOptions]);

  // when the current/ req/ req options changes -> change the request
  useEffect(() => {
    console.log('req effect', requestOptions);
    const firstOption = requestOptions[0] || '-';
    const secondOption = requestOptions[1] || '-';

    if (current === request || request === '-')
      if (current === firstOption) setRequest(secondOption);
      else setRequest(firstOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestOptions, current, request]);
};

export default useUpdateInputs;
