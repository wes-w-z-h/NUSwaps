import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Swap } from '../../types/Swap';
import { Button, Grid } from '@mui/material';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import { Module } from '../../types/modules';

type SwapRowProps = {
  row: Swap;
  editSwap: {
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
  deleteSwap: {
    deleteSwap: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
  };
  getModsInfo: {
    error: string | null;
    getModInfo: (courseId: string) => Promise<Module | undefined>;
    loading: boolean;
  };
};

const SwapRow: React.FC<SwapRowProps> = ({
  row,
  editSwap,
  deleteSwap,
  getModsInfo,
}) => {
  const [open, setOpen] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <React.Fragment>
      <DeleteModal
        swap={row}
        open={openDelModal}
        setOpen={setOpenDelModal}
        deleteSwapObj={deleteSwap}
      />
      <EditModal
        swap={row}
        open={openEditModal}
        setOpen={setOpenEditModal}
        editSwapObj={editSwap}
        getModsInfo={getModsInfo}
      />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{row.courseId}</TableCell>
        <TableCell>{row.lessonType}</TableCell>
        <TableCell>{row.current}</TableCell>
        <TableCell>{row.request}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            color="secondary"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container sx={{ margin: 2 }}>
              <Grid item style={{ textAlign: 'center' }} xs={6}>
                <Button onClick={() => setOpenEditModal(true)}>edit</Button>
              </Grid>
              <Grid item style={{ textAlign: 'center' }} xs={6}>
                <Button color="warning" onClick={() => setOpenDelModal(true)}>
                  delete
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default SwapRow;
