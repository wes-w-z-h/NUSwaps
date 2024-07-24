import * as React from 'react';
import Box from '@mui/material/Box';
import { Match } from '../../types/Match';
import { Swap } from '../../types/Swap';
import MatchSummaryPanel from './MatchSummaryPanel';
import ModalTabs from './ModalTabs';
import TabPanel from './TabPanel';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import { useEffect, useState } from 'react';
import { PartnerDetail } from '../../types/User';
import { Module } from '../../types/modules';

const style = {
  position: 'absolute' as const,
  flexGrow: 1,
  display: 'flex',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  height: '70%',
  bgcolor: '#F7F7FF',
  // border: '2px solid #000',
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};

type MatchModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  swap: Swap;
  getMatchObj: {
    getMatch: (id: string) => Promise<Match>;
    error: string | null;
    loading: boolean;
  };
  getMatchPartnerObj: {
    getMatchPartners: (swaps: string[]) => Promise<PartnerDetail[]>;
    error: string | null;
    loading: boolean;
  };
  getSwapObj: {
    getSwap: (id: string) => Promise<Swap>;
    error: string | null;
    loading: boolean;
  };
  getModsInfo: {
    getModInfo: (courseId: string) => Promise<Module | undefined>;
    error: string | null;
    loading: boolean;
  };
};

const MatchModal: React.FC<MatchModalProps> = ({
  open,
  setOpen,
  swap,
  getMatchObj,
  getMatchPartnerObj,
  getSwapObj,
  getModsInfo,
}) => {
  const [active, setActive] = useState(0);
  const [match, setMatch] = useState<Match>({} as Match);
  const [matchedSwaps, setMatchedSwaps] = useState<Swap[]>([]);
  const [partnerDetails, setPartnerDetails] = useState<PartnerDetail[]>([]);

  const handleClose = () => setOpen(false);
  const getMatchInfo = async () => {
    // Get match
    const match = await getMatchObj.getMatch(swap.id);
    setMatch(match);

    // Get swaps in match
    const matchedSwaps = await Promise.all(
      match.swaps.map(async (id): Promise<Swap> => await getSwapObj.getSwap(id))
    );
    setMatchedSwaps(matchedSwaps);
    const swapIds = matchedSwaps.map((s) => s?.id);
    const partnerDetails = await getMatchPartnerObj.getMatchPartners(swapIds);
    setPartnerDetails(partnerDetails);
  };

  useEffect(() => {
    if (open) getMatchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
          <ModalTabs
            active={active}
            setActive={setActive}
            swaps={matchedSwaps}
          />
          <MatchSummaryPanel
            active={active}
            index={0}
            matchedSwaps={matchedSwaps}
            match={match}
          />
          {matchedSwaps.map((swap, index) => (
            <TabPanel
              active={active}
              partnerDetail={
                index < partnerDetails.length
                  ? partnerDetails[index]
                  : { id: '', email: '', telegramHandle: '' } // should not reach here but jic
              }
              index={index + 1}
              swap={swap}
              getModsInfo={getModsInfo}
              key={index + 1}
            />
          ))}
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default MatchModal;
