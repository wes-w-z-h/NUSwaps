import React from 'react';
import Box from '@mui/material/Box';
import { Swap } from '../../types/Swap';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import { useModsContext } from '../../hooks/mods/useModsContext';
import { useEffect, useState } from 'react';
import { Module } from '../../types/modules';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider'; // Import Divider

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

type MatchModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  swap: Swap;
  getModsInfo: {
    error: string | null;
    getModInfo: (courseId: string) => Promise<Module | undefined>;
    loading: boolean;
  };
};

type FieldElement = {
  label: string;
  value: string | number | undefined;
};

const DetailsModal: React.FC<MatchModalProps> = ({
  open,
  setOpen,
  swap,
  getModsInfo,
}) => {
  const handleClose = () => setOpen(false);
  const { modsState } = useModsContext();
  const [fields, setFields] = useState<FieldElement[]>([]);

  const getClassDetails = async () => {
    let mod = modsState.mods.find((m) => m.moduleCode === swap.courseId);
    if (!mod) {
      mod = await getModsInfo.getModInfo(swap.courseId);
    }
    if (!mod) return;
    const modDetails = mod.semesterData[0].timetable.find(
      (l) => l.lessonType === swap.lessonType && l.classNo === swap.current
    );

    const fields = [
      { label: 'Class Number', value: modDetails?.classNo },
      { label: 'Day', value: modDetails?.day },
      { label: 'Start Time', value: modDetails?.startTime },
      { label: 'End Time', value: modDetails?.endTime },
      { label: 'Lesson Type', value: modDetails?.lessonType },
      { label: 'Venue', value: modDetails?.venue },
      { label: 'Size', value: modDetails?.size },
    ];

    setFields(fields);
  };

  useEffect(() => {
    if (open) getClassDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
        <Box sx={style}>
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            Class Details
          </Typography>
          <Divider sx={{ my: 2, bgcolor: 'salmon' }} />
          <Grid container spacing={2}>
            {fields.map(
              (field, index) =>
                field.value && (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography variant="body1" component="div">
                      <strong>{field.label}:</strong> {field.value}
                    </Typography>
                  </Grid>
                )
            )}
          </Grid>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default DetailsModal;
