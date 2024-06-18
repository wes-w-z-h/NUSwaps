import { useState } from 'react';
import { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { useAxiosPrivate } from '../api/useAxiosPrivate';

export const useAddSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

    await axiosPrivate
      .post('/swaps', data)
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
