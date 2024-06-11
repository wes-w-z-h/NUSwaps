import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Swap } from '../../types/Swap';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import SwapRow from './SwapRow';

const SwapTable = () => {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const { state } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSwaps = async () => {
      try {
        await axios
          .get<Swap[]>('http://localhost:4000/api/swaps/userswaps', {
            headers: { Authorization: `Bearer ${state.user?.token}` },
          })
          .then((data) => {
            setSwaps(data.data);
            console.log(data.data);
          });
      } catch (err) {
        setError('Failed to fetch swaps');
      }
    };

    if (state.user) {
      getSwaps();
    }
  }, [state.user]);

  if (error) {
    return <Typography>{error}</Typography>;
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible swaps table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Course ID</TableCell>
            <TableCell>Lesson Type</TableCell>
            <TableCell>Current</TableCell>
            <TableCell>Request</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {swaps.map((swap) => (
            <SwapRow key={swap.id} row={swap} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SwapTable;
