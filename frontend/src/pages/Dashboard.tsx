import CustomAlert from '../components/CustomAlert';
import SwapTable from '../components/swap/SwapTable';
import useGetSwaps from '../hooks/useGetSwaps';

const Dashboard = () => {
  const { error } = useGetSwaps();
  return (
    <>
      <div className="dashboard">
        {error && <CustomAlert message={error} />}
        <SwapTable />
      </div>
    </>
  );
};

export default Dashboard;
