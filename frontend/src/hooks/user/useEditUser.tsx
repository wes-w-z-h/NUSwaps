import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../auth/useAuthContext';

const useEditUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { authState } = useAuthContext();

  const editUser = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);

    await axios
      .patch(
        `http://localhost:4000/api/users/edit`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        { headers: { Authorization: `Bearer ${authState.user?.token}` } }
      )
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
