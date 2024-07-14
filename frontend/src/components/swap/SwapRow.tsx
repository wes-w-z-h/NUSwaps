import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import { Swap } from '../../types/Swap';
import { Button, Grid, Tooltip } from '@mui/material';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import { Module } from '../../types/modules';

// TODO: Possible to create separate components for different swap statuses
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
  } | null;
  deleteSwap: {
    deleteSwap: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
  } | null;
  confirmSwap: {
    confirmSwap: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
  } | null;
  rejectSwap: {
    rejectSwap: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
  } | null;
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
  confirmSwap,
  rejectSwap,
  getModsInfo,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openMatchModal, setOpenMatchModal] = useState(false);

  return (
    <React.Fragment>
      {deleteSwap && (
        <DeleteModal
          swap={row}
          open={openDelModal}
          setOpen={setOpenDelModal}
          deleteSwapObj={deleteSwap}
        />
      )}
      {editSwap && (
        <EditModal
          swap={row}
          open={openEditModal}
          setOpen={setOpenEditModal}
          editSwapObj={editSwap}
          getModsInfo={getModsInfo}
        />
      )}
      {openMatchModal && <div>Match Modal Here</div>}
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
            onClick={() => setOpenDrawer(!openDrawer)}
            color="secondary"
          >
            {openDrawer ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Tooltip title="View match details">
            <IconButton
              aria-label="view match"
              size="small"
              onClick={() => setOpenMatchModal(!openMatchModal)}
              color="secondary"
            >
              {row.status !== 'UNMATCHED' && <VisibilityIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Pending confirmation">
            <IconButton
              aria-label="prompt user action"
              size="small"
              onClick={() => setOpenDrawer(!openDrawer)}
              color="error"
            >
              {row.status === 'MATCHED' && <PriorityHighRoundedIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={openDrawer} timeout="auto" unmountOnExit>
            <Grid container sx={{ margin: 2 }}>
              {editSwap && (
                <Grid item style={{ textAlign: 'center' }} xs>
                  <Button onClick={() => setOpenEditModal(true)}>edit</Button>
                </Grid>
              )}
              {deleteSwap && (
                <Grid item style={{ textAlign: 'center' }} xs>
                  <Button color="warning" onClick={() => setOpenDelModal(true)}>
                    delete
                  </Button>
                </Grid>
              )}
              {confirmSwap && (
                <Grid item style={{ textAlign: 'center' }} xs>
                  <Button
                    onClick={() => confirmSwap.confirmSwap(row.id)}
                    disabled={confirmSwap.loading || rejectSwap?.loading}
                  >
                    confirm
                  </Button>
                </Grid>
              )}
              {rejectSwap && (
                <Grid item style={{ textAlign: 'center' }} xs>
                  <Button
                    color="warning"
                    onClick={() => rejectSwap.rejectSwap(row.id)}
                    disabled={confirmSwap?.loading || rejectSwap.loading}
                  >
                    reject
                  </Button>
                </Grid>
              )}
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default SwapRow;
