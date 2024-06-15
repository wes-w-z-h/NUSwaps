import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import validateAddSwap from '../../util/auth/validateAddSwap';
import { useAddSwap } from '../../hooks/useAddSwap';
import CustomAlert from '../CustomAlert';

const SwapInputRow = () => {
  const lessonTypes: string[] = ['Tutorial', 'Recitation', 'Lab'];
  const intialErrorState = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
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
    const inputErrors = validateAddSwap(courseId, lessonType, current, request);
    console.log(inputErrors);
    setInputErrors(inputErrors);

    if (
      inputErrors.courseId !== '' ||
      inputErrors.lessonType !== '' ||
      inputErrors.current !== '' ||
      inputErrors.request !== ''
    ) {
      return;
    }

    await addSwap(courseId, lessonType, current, request);
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
            error={inputErrors.courseId !== ''}
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
            error={inputErrors.lessonType !== ''}
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
            error={inputErrors.current !== ''}
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
            error={inputErrors.request !== ''}
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
          <Button
            fullWidth
            type="submit"
            variant="text"
            color="success"
            disabled={loading}
            onClick={handeClick}
          >
            Add Swap
          </Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default SwapInputRow;
