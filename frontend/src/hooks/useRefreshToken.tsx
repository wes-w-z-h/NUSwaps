import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios, { AxiosError } from 'axios';

export const useRefreshToken = () => {
  const [error, setError] = useState<AxiosError>({} as AxiosError);
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const refresh = async () => {
    setLoading(true);
    setError({} as AxiosError);
    await axios
      .get('http://localhost:4000/api/auth/refresh', {
        withCredentials: true,
      })
      .then((res) => {
        let user;
        const userStr = localStorage.getItem('user');
        if (userStr) {
          user = JSON.parse(userStr);
          user.token = res.data.token;
          localStorage.setItem('user', JSON.stringify(user));
        }
        dispatch({
          type: 'REFRESH',
          payload: user,
        });

        return res.data.token;
      })
      .catch((err) => {
        setError(err);
      });

    setLoading(false);
  };

  return { refresh, loading, error };
};
