import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SwapRow from './SwapRow';
import { Swap } from '../../types/Swap';

const SwapTable: React.FC<{ swaps: Swap[] }> = ({ swaps }) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible swaps table">
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Lesson Type</TableCell>
              <TableCell>Current</TableCell>
              <TableCell>Request</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {swaps.map((swap) => (
              <SwapRow key={swap.id} row={swap} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SwapTable;
