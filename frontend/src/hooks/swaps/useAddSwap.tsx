import { useState } from 'react';
import { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';

export const useAddSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useLogout();
  const { swapsDispatch } = useSwapsContext();
  const axiosPrivate = useAxiosPrivate();

  const addSwap = async (
    courseId: string,
    lessonType: string,
    current: string,
    request: string
  ) => {
    setLoading(true);
    setError(null);

    const data = {
      courseId: courseId,
      lessonType: lessonType,
      current: current,
      request: request,
    };

    await axiosPrivate
      .post('/swaps', data)
      .then((res) => {
        swapsDispatch({ type: 'CREATE_SWAP', payload: res.data });
      })
      .catch((error: AxiosError<{ error: string }>) => {
        console.log(error.response);
        if (error.response?.data.error.startsWith('E11000')) {
          setError(error.message + ', Duplicate swaps are not allowed');
          return;
        }
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

  return { addSwap, loading, error };
};
