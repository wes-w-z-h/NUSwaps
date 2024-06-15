import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSwapsContext } from './useSwapsContext';
import { useAuthContext } from '../auth/useAuthContext';
import { Swap } from '../../types/Swap';

const useEditSwap = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { swapsDispatch } = useSwapsContext();
  const { authState } = useAuthContext();

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
      .patch<Swap>(`http://localhost:4000/api/swaps/${id}`, data, {
        headers: { Authorization: `Bearer ${authState.user?.token}` },
      })
      .then((res) => {
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
