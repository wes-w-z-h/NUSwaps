import React, { SetStateAction, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuItem from '@mui/material/MenuItem';
import validateSwap from '../../util/swaps/validateSwap';
import { useAddSwap } from '../../hooks/swaps/useAddSwap';
import CustomAlert from '../CustomAlert';

const SwapInputRow: React.FC<{
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const lessonTypes: string[] = ['Tutorial', 'Recitation', 'Lab'];
  const intialErrorState = {
    courseId: ' ',
    lessonType: ' ',
    current: ' ',
    request: ' ',
  };

  const [lessonType, setLessonType] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [request, setRequest] = useState<string>('');
  const [inputErrors, setInputErrors] = useState(intialErrorState);
  const { addSwap, loading, error } = useAddSwap();

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

    await addSwap(courseId, lessonType, current, request);
    setOpen(false);
    setCourseId('');
    setLessonType('');
    setCurrent('');
    setRequest('');
  };

  return (
    <React.Fragment>
      {error && <CustomAlert message={error} />}
      <TableRow>
        <TableCell>
          <TextField
            required
            error={inputErrors.courseId !== ' '}
            helperText={inputErrors.courseId}
            margin="normal"
            size="small"
            label="CourseId"
            id="CourseId"
            onChange={changeHandler(setCourseId)}
            value={courseId.toUpperCase().trim()}
            sx={{ width: '13vw' }}
          />
        </TableCell>
        <TableCell>
          <TextField
            required
            select
            error={inputErrors.lessonType !== ' '}
            helperText={inputErrors.lessonType}
            margin="normal"
            size="small"
            label="lessonType"
            id="LessonType"
            onChange={changeHandler(setLessonType)}
            value={lessonType}
            sx={{ width: '11vw' }}
          >
            {lessonTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </TableCell>
        <TableCell>
          <TextField
            required
            error={inputErrors.current !== ' '}
            helperText={inputErrors.current}
            margin="normal"
            size="small"
            label="Current"
            id="Current"
            onChange={changeHandler(setCurrent)}
            value={current}
            sx={{ width: '13vw' }}
          />
        </TableCell>
        <TableCell>
          <TextField
            required
            error={inputErrors.request !== ' '}
            helperText={inputErrors.request}
            margin="normal"
            size="small"
            label="Request"
            id="Request"
            onChange={changeHandler(setRequest)}
            value={request}
            sx={{ width: '13vw' }}
          />
        </TableCell>
        <TableCell>
          <Tooltip title="Add swap" placement="bottom">
            <IconButton color="success" onClick={handeClick} disabled={loading}>
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
