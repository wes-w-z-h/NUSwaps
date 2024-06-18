import { axiosPrivate } from '../../util/api/axios';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { authDispatch } = useAuthContext();

  const logout = async () => {
    await axiosPrivate.post('/auth/logout');
    localStorage.removeItem('user');
    authDispatch({ type: 'LOGOUT' });
  };

  return { logout };
};
