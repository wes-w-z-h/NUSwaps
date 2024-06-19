import { useState } from 'react';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';

const useDeleteUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const { logout } = useLogout();

  const deleteUser = async () => {
    setLoading(true);
    setError(null);

    await axiosPrivate
      .delete(`/users/delete`)
      .then(() => {
        logout();
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          logout();
        }
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
