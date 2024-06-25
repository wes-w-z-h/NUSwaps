import React, { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Swap } from '../../types/Swap';
import validateSwap from '../../util/swaps/validateSwap';
import { Typography } from '@mui/material';

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
};

const EditModal: React.FC<EditModalProps> = ({
  swap,
  open,
  setOpen,
  editSwapObj,
}) => {
  const { editSwap, loading, error } = editSwapObj;
  const lessonTypes: string[] = ['Tutorial', 'Recitation', 'Lab'];
  const intialErrorState = {
    courseId: ' ',
    lessonType: ' ',
    current: ' ',
    request: ' ',
  };

  const [courseId, setCourseId] = useState<string>(swap.courseId);
  const [lessonType, setLessonType] = useState<string>(swap.lessonType);
  const [current, setCurrent] = useState<string>(
    swap.current.slice(swap.lessonType.length + 1)
  );
  const [request, setRequest] = useState<string>(
    swap.request.slice(swap.lessonType.length + 1)
  );
  const [inputErrors, setInputErrors] = useState(intialErrorState);

  const handleClose = (reset: boolean) => {
    setOpen(false);
    if (reset) {
      setCourseId(swap.courseId);
      setLessonType(swap.lessonType);
      setCurrent(swap.current.slice(swap.lessonType.length + 1));
      setRequest(swap.request.slice(swap.lessonType.length + 1));
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

  useEffect(() => {
    if (!loading) {
      handleClose(!!error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  const changeHandler = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const handler = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setter(event.target.value);
      setInputErrors(intialErrorState);
    };
    return handler;
  };

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
            <TextField
              fullWidth
              required
              error={inputErrors.courseId !== ' '}
              helperText={inputErrors.courseId}
              margin="normal"
              size="small"
              label="CourseId"
              id="CourseId"
              value={courseId.toUpperCase().trim()}
              onChange={changeHandler(setCourseId)}
            />
            <TextField
              fullWidth
              required
              select
              error={inputErrors.lessonType !== ' '}
              helperText={inputErrors.lessonType}
              margin="normal"
              size="small"
              label="Lesson Type"
              InputLabelProps={{ htmlFor: 'lesson-type-select' }}
              SelectProps={{
                native: false,
                labelId: 'lesson-type-label',
                inputProps: {
                  id: 'lesson-type-select',
                },
              }}
              value={lessonType}
              onChange={changeHandler(setLessonType)}
            >
              {lessonTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              required
              error={inputErrors.current !== ' '}
              helperText={inputErrors.current}
              margin="normal"
              size="small"
              label="Current"
              id="Current"
              value={current}
              onChange={changeHandler(setCurrent)}
            />
            <TextField
              fullWidth
              required
              error={inputErrors.request !== ' '}
              helperText={inputErrors.request}
              margin="normal"
              size="small"
              label="Request"
              id="Request"
              value={request}
              onChange={changeHandler(setRequest)}
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
