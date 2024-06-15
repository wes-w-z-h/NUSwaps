import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { useAuthContext } from '../auth/useAuthContext';

const useDeleteSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { swapsDispatch } = useSwapsContext();
  const { authState } = useAuthContext();

  const deleteSwap = async (id: string) => {
    setLoading(true);
    setError(null);

    await axios
      .delete(`http://localhost:4000/api/swaps/${id}`, {
        headers: { Authorization: `Bearer ${authState.user?.token}` },
      })
      .then((res) => {
        swapsDispatch({ type: 'DELETE_SWAP', payload: res.data });
      })
      .catch((error: AxiosError<{ error: string }>) => {
        console.log(error);
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
