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
      const lts = mod.semesterData[0].timetable
        .map((v) => v.lessonType)
        .filter((v) => v !== 'Lecture');
      // console.log('mod effect');
      const s: Set<string> = new Set();
      lts.forEach((v) => s.add(v));
      setLessonTypes([...s]);
      if (!s.has(lessonType)) setLessonType(lts[0] ? lts[0] : '-');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod]);

  // when the lessonType changes -> change the current and request
  useEffect(() => {
    if (mod) {
      const options = mod?.semesterData[0].timetable
        .filter((v) => v.lessonType === lessonType)
        .map((v) => v.classNo);
      // console.log('lessonType effect', lessonType);
      const firstOption = options[0] || '-';
      setCurrentOptions(options);
      setRequestOptions(options);
      if (!options.includes(current)) setCurrent(firstOption);
      if (!options.includes(request)) setRequest(firstOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonType, mod]);

  // when the current/ options changes -> change the requestOptions
  useEffect(() => {
    if (currentOptions) {
      setRequestOptions(currentOptions.filter((v) => v !== current));
      // console.log('current effect', currentOptions);
    } else setRequestOptions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, currentOptions]);

  // when the current/ req/ req options changes -> change the request
  useEffect(() => {
    const firstOption = requestOptions[0] || '-';
    const secondOption = requestOptions[1] || '-';
    // console.log('request effect', requestOptions);

    if (current === request || request === '-') {
      // console.log('request', request);
      if (current === firstOption) setRequest(secondOption);
      else setRequest(firstOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestOptions, current]);
};

export default useUpdateInputs;
