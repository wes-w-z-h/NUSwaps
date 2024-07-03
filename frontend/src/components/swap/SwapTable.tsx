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
import useEditSwap from '../../hooks/swaps/useEditSwap';
import useDeleteSwap from '../../hooks/swaps/useDeleteSwap';
import useGetModsInfo from '../../hooks/mods/useGetModInfo';
import useConfirmSwap from '../../hooks/swaps/useConfirmSwap';
import { useRejectSwap } from '../../hooks/swaps/useRejectSwap';

const SwapTable: React.FC = () => {
  const { swapsState } = useSwapsContext();
  const [open, setOpen] = useState(false);
  const addSwap = useAddSwap();
  const editSwap = useEditSwap();
  const deleteSwap = useDeleteSwap();
  const confirmSwap = useConfirmSwap();
  const rejectSwap = useRejectSwap();
  const getModsInfo = useGetModsInfo();

  return (
    <>
      {addSwap.error && <CustomAlert message={addSwap.error} />}
      {editSwap.error && <CustomAlert message={editSwap.error} />}
      {deleteSwap.error && <CustomAlert message={deleteSwap.error} />}
      {getModsInfo.error && <CustomAlert message={getModsInfo.error} />}
      {confirmSwap.error && <CustomAlert message={confirmSwap.error} />}
      {rejectSwap.error && <CustomAlert message={rejectSwap.error} />}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible swaps table">
          <TableHead>
            {open && (
              <SwapInputRow
                setOpen={setOpen}
                addSwap={addSwap}
                getModsInfo={getModsInfo}
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
              <SwapRow
                key={swap.id}
                row={swap}
                editSwap={swap.status === 'UNMATCHED' ? editSwap : null}
                deleteSwap={swap.status === 'UNMATCHED' ? deleteSwap : null}
                getModsInfo={getModsInfo}
                confirmSwap={swap.status === 'MATCHED' ? confirmSwap : null}
                rejectSwap={swap.status === 'MATCHED' ? rejectSwap : null}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SwapTable;
