import { useState } from 'react';
import { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';

export const useConfirmSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useLogout();
  const { swapsDispatch } = useSwapsContext();
  const axiosPrivate = useAxiosPrivate();

  const confirmSwap = async (id: string) => {
    setLoading(true);
    setError(null);

    await axiosPrivate
      .patch(`/swaps/confirm/${id}`)
      .then((res) => {
        swapsDispatch({ type: 'UPDATE_SWAP', payload: res.data });
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

  return { confirmSwap, loading, error };
};
