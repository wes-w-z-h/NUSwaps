import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import Tooltip from '@mui/material/Tooltip';
import SwapRow from './SwapRow';
import { useSwapsContext } from '../../hooks/swaps/useSwapsContext';
import SwapInputRow from './SwapInputRow';
import { useAddSwap } from '../../hooks/swaps/useAddSwap';
import CustomAlert from '../CustomAlert';

const SwapTable: React.FC = () => {
  const { swapsState } = useSwapsContext();
  const [open, setOpen] = useState(false);
  const { addSwap, loading, error } = useAddSwap();

  return (
    <>
      {error && <CustomAlert message={error} />}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible swaps table">
          <TableHead>
            {open && (
              <SwapInputRow
                setOpen={setOpen}
                loading={loading}
                addSwap={addSwap}
              />
            )}
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Lesson Type</TableCell>
              <TableCell>Current</TableCell>
              <TableCell>Request</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                {!open && (
                  <Tooltip title="Add swap" placement="bottom">
                    <IconButton onClick={() => setOpen(true)} color="success">
                      <AddCircleOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {swapsState.swaps.map((swap) => (
              <SwapRow key={swap.id} row={swap} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SwapTable;
