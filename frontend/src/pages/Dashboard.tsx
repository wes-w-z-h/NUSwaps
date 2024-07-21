import CustomAlert from '../components/CustomAlert';
import SwapTable from '../components/swap/SwapTable';
import useGetSwaps from '../hooks/swaps/useGetSwaps';
import useGetMods from '../hooks/mods/useGetMods';
import { MatchToast } from '../components/match/MatchToast';

const Dashboard = () => {
  const { error } = useGetSwaps();
  const { error: modErr } = useGetMods();

  return (
    <>
      <div className="dashboard">
        <MatchToast /> // TODO: Find a better place to put this component
        {error && <CustomAlert message={error} />}
        {modErr && <CustomAlert message={modErr} />}
        <SwapTable />
      </div>
    </>
  );
};

export default Dashboard;
