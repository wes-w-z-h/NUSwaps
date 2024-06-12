import CustomAlert from '../components/CustomAlert';
import SwapTable from '../components/swap/SwapTable';
import useGetSwaps from '../hooks/useGetSwaps';

const Dashboard = () => {
  const { swaps, error } = useGetSwaps();
  return (
    <>
      <div className="dashboard">
        {error && <CustomAlert message={error} />}
        <SwapTable swaps={swaps} />
      </div>
    </>
  );
};

export default Dashboard;
