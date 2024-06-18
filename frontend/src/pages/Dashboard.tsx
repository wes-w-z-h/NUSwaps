import CustomAlert from '../components/CustomAlert';
import SwapTable from '../components/swap/SwapTable';
import useGetSwaps from '../hooks/swaps/useGetSwaps';
import { useNavigate } from 'react-router-dom';
import { useAxiosPrivate } from '../hooks/api/useAxiosPrivate';
import { useRefreshToken } from '../hooks/api/useRefreshToken';
import { useLogout } from '../hooks/auth/useLogout';

const Dashboard = () => {
  const { error } = useGetSwaps();
  const { refresh } = useRefreshToken();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  async function handleClick() {
    try {
      const response = await axiosPrivate.get('/swaps/userswaps');
      console.log(response.data);
    } catch (err) {
      logout();
      navigate('/login');
    }
  }

  return (
    <>
      <div className="dashboard">
        {error && <CustomAlert message={error} />}
        <SwapTable />
        <button onClick={() => refresh()}>Refresh</button>
        <button onClick={handleClick}>click</button>
      </div>
    </>
  );
};

export default Dashboard;
