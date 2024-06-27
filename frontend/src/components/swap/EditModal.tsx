import React, { SetStateAction, useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { Swap } from '../../types/Swap';
import validateSwap from '../../util/swaps/validateSwap';
import { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Virtualize from './input/VirtAutocomplete';
import { useModsContext } from '../../hooks/mods/useModsContext';
import useUpdateInputs from '../../hooks/swaps/useUpdateInputs';
import { Module } from '../../types/modules';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

type EditModalProps = {
  swap: Swap;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editSwapObj: {
    editSwap: (
      id: string,
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

const EditModal: React.FC<EditModalProps> = ({
  swap,
  open,
  setOpen,
  editSwapObj,
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
  const [courseId, setCourseId] = useState<string>(swap.courseId);
  const [lessonType, setLessonType] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [request, setRequest] = useState<string>('');
  const { editSwap, loading, error } = editSwapObj;
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

  const handleClose = (reset: boolean) => {
    setOpen(false);
    if (reset) {
      setCourseId(swap.courseId);
      setLessonType(swap.lessonType);
      setCurrent(swap.current);
      setRequest(swap.request);
    }
  };
  const handleSubmit = async () => {
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
    await editSwap(swap.id, courseId, lessonType, current, request);
  };

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

  useEffect(() => {
    updateMod(swap.courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      handleClose(!!error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  return (
    <React.Fragment>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => handleClose(true)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} textAlign={'center'} component="form">
            <Typography variant="subtitle1">Edit swap</Typography>
            <Virtualize
              id="CourseId"
              label="Course Id"
              width="100%"
              options={modsState.moduleCodes}
              error={inputErrors.courseId}
              value={courseId}
              handleChange={changeHandler(setCourseId, updateMod)}
            />
            <Virtualize
              id="lessonType-combo-box"
              label="Lesson Type"
              width="100%"
              options={lessonTypes}
              error={inputErrors.lessonType}
              value={lessonType}
              handleChange={changeHandler(setLessonType)}
              equalityFunc={(option, value) =>
                value === '-' || option === value
              }
            />
            <Virtualize
              id="current-combo-box"
              label="Current"
              width="100%"
              options={currentOptions}
              error={inputErrors.current}
              value={current}
              handleChange={changeHandler(setCurrent)}
              equalityFunc={(option, value) =>
                value === '-' || option === value
              }
            />
            <Virtualize
              id="request-combo-box"
              label="Request"
              width="100%"
              options={requestOptions}
              error={inputErrors.request}
              value={request}
              handleChange={changeHandler(setRequest)}
              equalityFunc={(option, value) =>
                value === '-' || option === value
              }
            />
            <Button
              variant="text"
              color="secondary"
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
            >
              Confirm change
            </Button>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default EditModal;
