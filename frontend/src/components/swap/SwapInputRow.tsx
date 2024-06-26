import React, { SetStateAction, useEffect, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import validateSwap from '../../util/swaps/validateSwap';
import { useModsContext } from '../../hooks/mods/useModsContext';
import Virtualize from './input/VirtAutocomplete';
import { Module } from '../../types/modules';

type SwapInputRowProps = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  addSwap: {
    addSwap: (
      courseId: string,
      lessonType: string,
      current: string,
      request: string
    ) => Promise<void>;
    loading: boolean;
    error: string | null;
  };
  getModsInfo: {
    error: string | null;
    getModInfo: (courseId: string) => Promise<Module | undefined>;
    loading: boolean;
  };
};

const SwapInputRow: React.FC<SwapInputRowProps> = ({
  setOpen,
  addSwap,
  getModsInfo,
}) => {
  const intialErrorState = {
    courseId: ' ',
    lessonType: ' ',
    current: ' ',
    request: ' ',
  };

  const { modsState } = useModsContext();
  const [mod, setMod] = useState<Module | null>(null);
  const [lessonTypes, setLessonTypes] = useState<string[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [requestOptions, setRequestOptions] = useState<string[]>([]);
  const [courseId, setCourseId] = useState<string>(modsState.moduleCodes[0]);
  const [lessonType, setLessonType] = useState<string>('-');
  const [current, setCurrent] = useState<string>('-');
  const [request, setRequest] = useState<string>('-');
  const [inputErrors, setInputErrors] = useState(intialErrorState);

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
  }, [lessonType, mod]);

  // when the current/ options changes -> change the requestOptions and request
  useEffect(() => {
    console.log('current effect');
    if (currentOptions) {
      setRequestOptions(currentOptions.filter((v) => v !== current));
    } else setRequestOptions([]);
  }, [current, currentOptions]);

  useEffect(() => {
    console.log('req effect', requestOptions);
    const firstOption = requestOptions[0] || '-';
    const secondOption = requestOptions[1] || '-';

    if (current === request || request === '-')
      if (current === firstOption) setRequest(secondOption);
      else setRequest(firstOption);
  }, [requestOptions, request, current]);

  const changeHandler =
    (
      setter: React.Dispatch<SetStateAction<string>>,
      f: (value?: string) => void = () => {}
    ) =>
    async (
      event: React.SyntheticEvent<Element, Event>,
      value: string,
      reason: AutocompleteChangeReason
    ): Promise<void> => {
      setInputErrors(intialErrorState);
      event.preventDefault();
      if (reason === 'clear') return;
      setter(value);
      f(value);
    };

  const updateMod = async (value?: string) => {
    let mod = modsState.mods.find((v) => v.moduleCode === value);
    if (!mod) {
      mod = await getModsInfo.getModInfo(value as string);
    }
    mod ? setMod(mod) : setMod(null);
  };

  const handeClick = async () => {
    const inputErrors = validateSwap(courseId, lessonType, current, request);
    setInputErrors(inputErrors);

    if (
      inputErrors.courseId !== ' ' ||
      inputErrors.lessonType !== ' ' ||
      inputErrors.current !== ' ' ||
      inputErrors.request !== ' '
    ) {
      return;
    }

    await addSwap.addSwap(courseId, lessonType, current, request);
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Virtualize
            id="courseId-combo-box"
            label="CourseId"
            width="13vw"
            options={modsState.moduleCodes}
            error={inputErrors.courseId}
            value={courseId}
            handleChange={changeHandler(setCourseId, updateMod)}
          />
        </TableCell>
        <TableCell>
          <Virtualize
            id="lessonType-combo-box"
            label="LessonType"
            width="13vw"
            options={lessonTypes}
            error={inputErrors.lessonType}
            value={lessonType}
            handleChange={changeHandler(setLessonType)}
          />
        </TableCell>
        <TableCell>
          <Virtualize
            id="current-combo-box"
            label="Current"
            width="13vw"
            options={currentOptions}
            error={inputErrors.current}
            value={current}
            handleChange={changeHandler(setCurrent)}
          />
        </TableCell>
        <TableCell>
          <Virtualize
            id="request-combo-box"
            label="Request"
            width="13vw"
            options={requestOptions}
            error={inputErrors.request}
            value={request}
            handleChange={changeHandler(setRequest)}
            equalityFunc={(option, value) => value === '-' || option === value}
          />
        </TableCell>
        <TableCell>
          <Tooltip title="Add swap" placement="bottom">
            <IconButton
              color="success"
              onClick={handeClick}
              disabled={addSwap.loading}
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Tooltip title="Cancel" placement="bottom">
            <IconButton onClick={() => setOpen(false)} color="error">
              <CancelRoundedIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default SwapInputRow;
