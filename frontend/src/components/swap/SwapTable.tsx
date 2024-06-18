import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SwapRow from './SwapRow';
import { useSwapsContext } from '../../hooks/swaps/useSwapsContext';
import SwapInputRow from './SwapInputRow';
import { Button } from '@mui/material';

const SwapTable: React.FC = () => {
  const { swapsState } = useSwapsContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible swaps table">
          <TableHead>
            {open && <SwapInputRow setOpen={setOpen} />}
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Lesson Type</TableCell>
              <TableCell>Current</TableCell>
              <TableCell>Request</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                {/* TODO: use an icon button instead */}
                {!open && (
                  <Button onClick={() => setOpen(!open)}> add swap </Button>
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
