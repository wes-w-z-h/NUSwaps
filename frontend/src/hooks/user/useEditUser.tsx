import { useState } from 'react';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';
import { useAuthContext } from '../auth/useAuthContext';

const useEditUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const { authDispatch } = useAuthContext();
  const { logout } = useLogout();

  const editUser = async (
    oldPassword: string,
    newPassword: string,
    teleHandle: string
  ) => {
    setLoading(true);
    setError(null);

    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      telegramHandle: teleHandle,
    };

    await axiosPrivate
      .patch(`/users/edit`, data)
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data.data));
        authDispatch({ type: 'UPDATE', payload: data.data.telegramHandle });
      })
      .catch((error) => {
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
  return { editUser, loading, error };
};

export default useEditUser;
