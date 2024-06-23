import React, { useState } from 'react';
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomAlert: React.FC<{
  message: string | null;
  severity?: 'error' | 'info';
}> = ({ message, severity = 'error' }) => {
  const [open, setOpen] = useState<boolean>(true);

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
    <React.Fragment>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="standard"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
export default CustomAlert;
