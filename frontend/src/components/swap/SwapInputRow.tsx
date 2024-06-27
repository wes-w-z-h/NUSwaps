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
import useUpdateInputs from '../../hooks/swaps/useUpdateInputs';

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
  const [submit, setSubmit] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState(intialErrorState);

  useUpdateInputs(
    {
      mod,
      lessonType,
      current,
      currentOptions,
      request,
      requestOptions,
    },
    {
      setLessonTypes,
      setLessonType,
      setCurrent,
      setRequest,
      setCurrentOptions,
      setRequestOptions,
    }
  );

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
    setSubmit(true);
  };

  useEffect(() => {
    if (submit) {
      if (!addSwap.error) {
        setOpen(false);
      }
      setSubmit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submit]);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Virtualize
            id="courseId-combo-box"
            label="Course Id"
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
            label="Lesson Type"
            width="13vw"
            options={lessonTypes}
            error={inputErrors.lessonType}
            value={lessonType}
            handleChange={changeHandler(setLessonType)}
            equalityFunc={(option, value) => value === '-' || option === value}
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
            equalityFunc={(option, value) => value === '-' || option === value}
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
