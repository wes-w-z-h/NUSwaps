import React, { useState } from 'react';
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomAlert: React.FC<{ message: string | null }> = ({ message }) => {
  const [open, setOpen] = useState<boolean>(true);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="standard"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default CustomAlert;
