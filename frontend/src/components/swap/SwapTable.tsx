import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Swap } from '../../types/Swap';
import axios, { AxiosError } from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import SwapRow from './SwapRow';
import Alert from '@mui/material/Alert';

const SwapTable = () => {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const { state } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSwaps = async () => {
      await axios
        .get<Swap[]>('http://localhost:4000/api/swaps/userswaps', {
          headers: { Authorization: `Bearer ${state.user?.token}` },
        })
        .then((data) => {
          setSwaps(data.data);
          console.log(data.data);
        })
        .catch((error: AxiosError<{ error: string }>) => {
          console.log(error);
          const message = error.response?.data
            ? `, ${error.response.data.error}`
            : '';
          setError(error.toString() + message);
        });
    };

    if (state.user) {
      getSwaps();
    }
  }, [state.user]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
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
    </>
  );
};

export default SwapTable;
