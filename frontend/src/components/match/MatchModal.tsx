import * as React from 'react';
import Box from '@mui/material/Box';
import { Match } from '../../types/Match';
import { Swap } from '../../types/Swap';
import MatchSummaryPanel from './MatchSummaryPanel';
import ModalTabs from './ModalTabs';
import TabPanel from './TabPanel';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';

const style = {
  position: 'absolute' as const,
  flexGrow: 1,
  display: 'flex',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  height: '70%',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};

type MatchModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  match: Match;
  swaps: Swap[];
};

const MatchModal: React.FC<MatchModalProps> = ({
  open,
  setOpen,
  match,
  swaps,
}) => {
  const [active, setActive] = React.useState(0);

  const handleClose = () => setOpen(false);

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
          <ModalTabs active={active} setActive={setActive} swaps={swaps} />
          <MatchSummaryPanel active={active} index={0} match={match} />
          {swaps.map((swap, index) => (
            <TabPanel
              active={active}
              index={index + 1}
              swap={swap}
              key={index + 1}
            />
          ))}
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default MatchModal;
