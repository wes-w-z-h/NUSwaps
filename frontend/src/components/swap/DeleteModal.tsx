import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Swap } from '../../types/Swap';

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
  p: 2,
};

type DeleteModalProps = {
  swap: Swap;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteSwapObj: {
    deleteSwap: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
  };
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  swap,
  open,
  setOpen,
  deleteSwapObj,
}) => {
  const { deleteSwap, loading } = deleteSwapObj;

  const handleClick = async () => {
    await deleteSwap(swap.id);
    handleClose();
  };

  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} textAlign={'center'}>
            <Typography id="courseId-status" variant="caption">
              Course: {swap.courseId} --- Status: {swap.status}
            </Typography>
            <Typography id="lessonType">
              Lesson type: {swap.lessonType}
            </Typography>
            <Typography id="current">Current slot: {swap.current}</Typography>
            <Typography id="request">Request slot: {swap.request}</Typography>
            <br />
            <Button
              variant="text"
              color="error"
              onClick={handleClick}
              disabled={loading}
            >
              Confirm delete
            </Button>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteModal;
