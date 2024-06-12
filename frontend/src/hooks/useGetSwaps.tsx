import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { Swap } from '../types/Swap';
import { useAuthContext } from './useAuthContext';

const useGetSwaps = () => {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const { state } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSwaps = async () => {
      await axios
        .get<Swap[]>('http://localhost:4000/api/swaps/userswaps', {
          headers: { Authorization: `Bearer ${state.user?.token}` },
        })
        .then((data) => {
          setSwaps(data.data);
          console.log(data.data);
        })
        .catch((error: AxiosError<{ error: string }>) => {
          console.log(error);
          const message = error.response?.data
            ? `, ${error.response.data.error}`
            : '';
          setError(error.message + message);
        });
    };

    if (state.user) {
      getSwaps();
    }
  }, [state.user]);

  return { swaps, error };
};

export default useGetSwaps;
