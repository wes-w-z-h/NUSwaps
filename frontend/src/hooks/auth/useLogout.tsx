import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../util/api/axios';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { authDispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    await axiosPrivate.post('/auth/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('moduleCodes');
    authDispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return { logout };
};
