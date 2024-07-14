import { useState } from 'react';
import { AxiosError } from 'axios';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';

const useGetSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useLogout();
  const axiosPrivate = useAxiosPrivate();

  const getSwap = async (id: string) => {
    setLoading(true);
    setError(null);

    const swap = await axiosPrivate
      .get(`/swaps/${id}`)
      .then((res) => res.data)
      .catch((error: AxiosError<{ error: string }>) => {
        console.log(error);
        if (error.response?.status === 403) {
          logout();
        }
        const message = error.response?.data
          ? `, ${error.response.data.error}`
          : '';
        setError(error.message + message);
      });
    setLoading(false);
    console.log(swap);

    return swap;
  };

  return { getSwap, loading, error };
};

export default useGetSwap;
