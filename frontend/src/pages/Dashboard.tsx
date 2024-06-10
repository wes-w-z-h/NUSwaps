import axios from 'axios';
import { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const Dashboard = () => {
  const { state } = useAuthContext();

  useEffect(() => {
    const getSwaps = () => {
      axios
        .get('http://localhost:4000/api/swaps/userswaps', {
          headers: { Authorization: `Bearer ${state.user?.token}` },
        })
        .then((data) => console.log(data.data))
        .catch((err) => console.log(err));
    };

    if (state.user) {
      getSwaps();
    }
    // this ensures that when the authContext updates the state, the Dashboard is updated
  }, [state.user]);

  return (
    <>
      <div className="dashboard">
        <h2>Dashboard</h2>
      </div>
    </>
  );
};

export default Dashboard;
