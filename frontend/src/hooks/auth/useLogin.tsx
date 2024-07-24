import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';
import { useSocketContext } from '../useSocketContext';
import { AxiosError } from 'axios';
import { axiosPrivate } from '../../util/api/axios';

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { authDispatch } = useAuthContext();
  const { socketDispatch } = useSocketContext();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const data = {
      email: email,
      password: password,
    };

    await axiosPrivate
      .post('/auth/login', data)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        authDispatch({ type: 'LOGIN', payload: res.data });
        socketDispatch({ type: 'CONNECT', payload: res.data });
        navigate('/dashboard');
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

  return { login, loading, error };
};
