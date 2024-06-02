import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';
import axios, { AxiosError } from 'axios';

export const useSignup = () => {
  const [error, setError] = useState<AxiosError>({} as AxiosError);
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signup = async (username: string, password: string) => {
    setLoading(true);
    setError({} as AxiosError);

    const data = {
      username: username,
      password: password,
    };

    await axios
      .post('http://localhost:4000/api/users/signup', data)
      .then((res) => {
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res.data));
        dispatch({ type: 'LOGIN', payload: res.data });
        // TODO: create a dashboard view for logged in users
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });

    setLoading(false);
  };

  return { signup, loading, error };
};
