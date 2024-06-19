import { useState } from 'react';
import { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';

const useDeleteSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { swapsDispatch } = useSwapsContext();
  const axiosPrivate = useAxiosPrivate();
  const { logout } = useLogout();

  const deleteSwap = async (id: string) => {
    setLoading(true);
    setError(null);

    await axiosPrivate
      .delete(`/swaps/${id}`)
      .then((res) => {
        swapsDispatch({ type: 'DELETE_SWAP', payload: res.data });
      })
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
  };

  return { deleteSwap, loading, error };
};

export default useDeleteSwap;
