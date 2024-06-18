import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../auth/useAuthContext';

const useDeleteUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { authState } = useAuthContext();

  const deleteUser = async () => {
    setLoading(true);
    setError(null);

    await axios
      .delete(`http://localhost:4000/api/users/delete`, {
        headers: { Authorization: `Bearer ${authState.user?.token}` },
      })
      .then((data) => console.log(data.data))
      .catch((error) => {
        const message = error.response?.data
          ? `, ${error.response.data.error}`
          : '';
        setError(error.message + message);
      });

    setLoading(false);
  };
  return { deleteUser, loading, error };
};

export default useDeleteUser;
