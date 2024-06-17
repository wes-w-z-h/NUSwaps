import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { useAuthContext } from '../auth/useAuthContext';

export const useAddSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { swapsDispatch } = useSwapsContext();
  const { authState } = useAuthContext();

  const addSwap = async (
    courseId: string,
    lessonType: string,
    current: string,
    request: string
  ) => {
    setLoading(true);
    setError(null);

    const data = {
      courseId: courseId.toUpperCase().trim(),
      lessonType: lessonType,
      current: {
        classNo: current.trim(),
        lessonType: lessonType,
      },
      request: {
        classNo: request.trim(),
        lessonType: lessonType,
      },
    };

    await axios
      .post('http://localhost:4000/api/swaps/', data, {
        headers: { Authorization: `Bearer ${authState.user?.token}` },
      })
      .then((res) => {
        swapsDispatch({ type: 'CREATE_SWAP', payload: res.data });
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

  return { addSwap, loading, error };
};
