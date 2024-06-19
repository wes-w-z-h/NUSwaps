import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { AxiosError } from 'axios';
import { axiosPublic } from '../../util/api/axios';

export const useRefreshToken = () => {
  const [error, setError] = useState<AxiosError>({} as AxiosError);
  const [loading, setLoading] = useState<boolean>(false);
  const { authDispatch } = useAuthContext();

  const refresh = async () => {
    setLoading(true);
    setError({} as AxiosError);
    const newToken = await axiosPublic
      .get('/auth/refresh', {
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
        authDispatch({
          type: 'REFRESH',
          payload: user,
        });

        return res.data.token;
      })
      .catch((err) => {
        setError(err);
      });

    setLoading(false);
    return newToken;
  };

  return { refresh, loading, error };
};
