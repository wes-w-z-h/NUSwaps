import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { Swap } from '../../types/Swap';
import { useAuthContext } from '../auth/useAuthContext';
import { useSwapsContext } from './useSwapsContext';
import { useAxiosPrivate } from '../api/useAxiosPrivate';

const useGetSwaps = () => {
  const { swapsDispatch } = useSwapsContext();
  const { authState } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getSwaps = async () => {
      await axiosPrivate
        .get<Swap[]>('/swaps/userswaps')
        .then((data) => {
          swapsDispatch({ type: 'SET_SWAPS', payload: data.data });
        })
        .catch((error: AxiosError<{ error: string }>) => {
          console.log(error);
          const message = error.response?.data
            ? `, ${error.response.data.error}`
            : '';
          setError(error.message + message);
        });
    };

    if (authState.user) {
      getSwaps();
    } else {
      swapsDispatch({ type: 'SET_SWAPS', payload: [] });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [authState.user]);

  return { error };
};

export default useGetSwaps;
