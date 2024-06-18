import { useState } from 'react';
import { useAxiosPrivate } from '../api/useAxiosPrivate';

const useEditUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const editUser = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);

    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    await axiosPrivate
      .patch(`/users/edit`, data)
      .then((data) => console.log(data.data))
      .catch((error) => {
        const message = error.response?.data
          ? `, ${error.response.data.error}`
          : '';
        setError(error.message + message);
      });

    setLoading(false);
  };
  return { editUser, loading, error };
};

export default useEditUser;
