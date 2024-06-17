import { useNavigate } from 'react-router-dom';
import SwapTable from '../components/swap/SwapTable';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import { useRefreshToken } from '../hooks/useRefreshToken';
import { useLogout } from '../hooks/useLogout';

const Dashboard = () => {
  const { refresh } = useRefreshToken();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  async function handleClick() {
    try {
      const response = await axiosPrivate.get('/api/swaps/userswaps');
      console.log(response.data);
    } catch (err) {
      logout();
      navigate('/login');
    }
  }
  return (
    <>
      <div className="dashboard">
        <SwapTable />
        <button onClick={() => refresh()}>Refresh</button>
        <button onClick={handleClick}>click</button>
      </div>
    </>
  );
};

export default Dashboard;
