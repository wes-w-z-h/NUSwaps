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
import { AutocompleteChangeReason } from '@mui/material';
import { useModsContext } from '../../hooks/mods/useModsContext';
import Virtualize from './input/VirtAutocomplete';

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
};

const SwapInputRow: React.FC<SwapInputRowProps> = ({ setOpen, addSwap }) => {
  const lessonTypes: string[] = ['Tutorial', 'Recitation', 'Lab'];
  const intialErrorState = {
    courseId: ' ',
    lessonType: ' ',
    current: ' ',
    request: ' ',
  };

  const { modsState } = useModsContext();
  const [lessonType, setLessonType] = useState<string>('');
  const [courseId, setCourseId] = useState<string>(modsState.moduleCodes[0]);
  const [current, setCurrent] = useState<string>('');
  const [request, setRequest] = useState<string>('');
  const [inputErrors, setInputErrors] = useState(intialErrorState);

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

    // console.log(courseId, lessonType, current, request);
    await addSwap.addSwap(courseId, lessonType, current, request);
  };

  const changeHandler2 = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const handler = (
      event: React.SyntheticEvent<Element, Event>,
      value: string,
      reason: AutocompleteChangeReason
    ) => {
      event.preventDefault();
      if (reason === 'clear' || reason === 'removeOption') return;

      setter(value);
      setInputErrors(intialErrorState);
    };
    return handler;
  };

  // TODO: change to virtualized autocomplete
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
            handleChange={changeHandler2(setCourseId)}
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
            label="Lesson Type"
            InputLabelProps={{ htmlFor: 'lesson-type-select' }}
            SelectProps={{
              native: false,
              labelId: 'lesson-type-label',
              inputProps: {
                id: 'lesson-type-select',
              },
            }}
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
