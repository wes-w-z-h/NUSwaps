import React, { SetStateAction, useEffect, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Autocomplete, {
  AutocompleteChangeReason,
} from '@mui/material/Autocomplete';
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
  const [lessonType, setLessonType] = useState<string>('-');
  const [lessonTypes, setLessonTypes] = useState<string[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [requestOptions, setRequestOptions] = useState<string[]>([]);
  const [courseId, setCourseId] = useState<string>(modsState.moduleCodes[0]);
  const [current, setCurrent] = useState<string>('-');
  const [request, setRequest] = useState<string>('-');
  const [inputErrors, setInputErrors] = useState(intialErrorState);

  // when the mod changes -> change the lessonType
  useEffect(() => {
    if (mod) {
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
    console.log(lessonType);
    if (mod) {
      const options = mod?.semesterData[0].timetable
        .filter((v) => v.lessonType === lessonType)
        .map((v) => v.classNo);
      setCurrentOptions(options);
      setCurrent(options[0] ? options[0] : '-');
      setRequestOptions(options);
      setRequest(options[0] ? options[0] : '-');
    }
  }, [lessonType, mod]);

  const courseIdChangeHandler = async (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === 'clear') {
      return;
    }
    event.preventDefault();
    setCourseId(value);
    let mod = modsState.mods.find((v) => v.moduleCode === value);
    if (!mod) {
      mod = await getModsInfo.getModInfo(value);
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
            width="13vw"
            options={modsState.moduleCodes}
            error={inputErrors.courseId}
            value={courseId}
            handleChange={courseIdChangeHandler}
          />
        </TableCell>
        <TableCell>
          <Autocomplete
            disablePortal
            disableClearable
            id="combo-box-demo"
            options={lessonTypes}
            value={lessonType}
            onChange={(_event, value) => setLessonType(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                margin="normal"
                size="small"
                label="LessonType"
                sx={{ width: '13vw' }}
                error={inputErrors.lessonType !== ' '}
                helperText={inputErrors.lessonType}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Autocomplete
            disablePortal
            disableClearable
            id="combo-box-demo"
            options={currentOptions}
            value={current}
            onChange={(_event, value) => setCurrent(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Current"
                margin="normal"
                size="small"
                error={inputErrors.current !== ' '}
                helperText={inputErrors.current}
                sx={{ width: '13vw' }}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Autocomplete
            disablePortal
            disableClearable
            id="combo-box-demo"
            options={requestOptions}
            value={request}
            onChange={(_event, value) => setRequest(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Request"
                margin="normal"
                size="small"
                error={inputErrors.request !== ' '}
                helperText={inputErrors.request}
                sx={{ width: '13vw' }}
              />
            )}
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
