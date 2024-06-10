import React, { useEffect, useState } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Swap } from '../../types/Swap';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Button, Grid } from '@mui/material';

const Row = (props: { row: Swap }) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.courseId}</TableCell>
        <TableCell>{row.lessonType}</TableCell>
        <TableCell>{row.current}</TableCell>
        <TableCell>{row.request}</TableCell>
        <TableCell>{row.status ? 'True' : 'False'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container sx={{ margin: 2 }}>
              <Grid item style={{ textAlign: 'center' }} xs={6}>
                <Button onClick={() => console.log('edit')}>edit</Button>
              </Grid>
              <Grid item style={{ textAlign: 'center' }} xs={6}>
                <Button color="warning" onClick={() => console.log('delete')}>
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
            <Row key={swap.id} row={swap} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SwapTable;
