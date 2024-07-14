import { useState } from 'react';
import { AxiosError } from 'axios';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';
import { Match } from '../../types/Match';

const useGetMatch = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useLogout();
  const axiosPrivate = useAxiosPrivate();

  const getMatch = async (id: string) => {
    setLoading(true);
    setError(null);

    const match: Match = await axiosPrivate
      .get(`/matches/${id}`)
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

    return match;
  };

  return { getMatch, loading, error };
};

export default useGetMatch;
