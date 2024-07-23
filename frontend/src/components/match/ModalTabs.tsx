import Tabs from '@mui/material/Tabs';
import { Swap } from '../../types/Swap';
import Tab from '@mui/material/Tab';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

type TabsProps = {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  swaps: Swap[];
};

const getCommonProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

const ModalTabs: React.FC<TabsProps> = ({ active, setActive, swaps }) => {
  const { authState } = useAuthContext();
  const handleChange = (_event: React.SyntheticEvent, newActive: number) => {
    setActive(newActive);
  };

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={active}
      onChange={handleChange}
      aria-label="Vertical tabs example"
      sx={{ borderRight: 1, borderColor: 'divider' }}
    >
      <Tab label="MATCH SUMMARY" {...getCommonProps(0)} />
      {/* TODO: Change style based on swapStatus */}
      {swaps.map((_swap, index) => {
        return (
          <Tab
            label={`${_swap.userId === authState.user?.id ? 'My swap' : 'Partner swap'}`}
            {...getCommonProps(index + 1)}
            key={index + 1}
          />
        );
      })}
    </Tabs>
  );
};

export default ModalTabs;
