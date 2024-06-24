import { AxiosError } from 'axios';
import { useLogout } from './useLogout';
import { axiosPrivate } from '../../util/api/axios';

export const useVerifyToken = () => {
  const { logout } = useLogout();

  const verifyToken = async () => {
    await axiosPrivate
      .get('/auth/verify-token')
      .catch((err: AxiosError<{ error: string }>) => {
        if (err.response?.status !== 200) {
          logout();
        }
      });
  };

  return { verifyToken };
};
