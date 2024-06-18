import { useState } from 'react';
import { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { Swap } from '../../types/Swap';
import { useAxiosPrivate } from '../api/useAxiosPrivate';

const useEditSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { swapsDispatch } = useSwapsContext();
  const axiosPrivate = useAxiosPrivate();

  const editSwap = async (
    id: string,
    courseId: string,
    lessonType: string,
    current: string,
    request: string
  ) => {
    setLoading(true);
    setError(null);

    const data = {
      id: id,
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
      .patch<Swap>(`swaps/${id}`, data)
      .then((res) => {
        console.log(res.data);
        swapsDispatch({ type: 'UPDATE_SWAP', payload: res.data });
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

  return { editSwap, loading, error };
};

export default useEditSwap;
