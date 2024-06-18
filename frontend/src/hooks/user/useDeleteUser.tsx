import { useState } from 'react';
import { useAxiosPrivate } from '../api/useAxiosPrivate';

const useDeleteUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const deleteUser = async () => {
    setLoading(true);
    setError(null);

    await axiosPrivate
      .delete(`/users/delete`)
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
