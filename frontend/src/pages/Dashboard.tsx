import CustomAlert from '../components/CustomAlert';
import SwapTable from '../components/swap/SwapTable';
import useGetSwaps from '../hooks/swaps/useGetSwaps';
import useGetMods from '../hooks/mods/useGetMods';

const Dashboard = () => {
  const { error } = useGetSwaps();
  const { error: modErr } = useGetMods();

  return (
    <>
      <div className="dashboard">
        {error && <CustomAlert message={error} />}
        {modErr && <CustomAlert message={modErr} />}
        <SwapTable />
      </div>
    </>
  );
};

export default Dashboard;
