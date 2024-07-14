import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Backdrop, Modal } from '@mui/material';
import { Match } from '../../types/Match';
import { Swap } from '../../types/Swap';
import MatchSummaryPanel from './MatchSummaryPanel';

const style = {
  position: 'absolute' as const,
  flexGrow: 1,
  display: 'flex',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '70%',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};

// Extract this to a separate component (Swap Detail and Match Summary)
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  active: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, active, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={active !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {active === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

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
  const handleChange = (event: React.SyntheticEvent, newActive: number) => {
    setActive(newActive);
  };

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
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={active}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
            <Tab label="Item Four" {...a11yProps(3)} />
          </Tabs>
          <MatchSummaryPanel active={active} index={0} match={match} />
          <TabPanel active={active} index={1}>
            Item Two
          </TabPanel>
          <TabPanel active={active} index={2}>
            Item Three
          </TabPanel>
          <TabPanel active={active} index={3}>
            Item Four
          </TabPanel>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default MatchModal;
