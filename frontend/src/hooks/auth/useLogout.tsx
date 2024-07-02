import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../util/api/axios';
import { useAuthContext } from './useAuthContext';
import { useSocketContext } from '../useSocketContext';

export const useLogout = () => {
  const { authDispatch } = useAuthContext();
  const { disconnectSocket } = useSocketContext();
  const navigate = useNavigate();

  const logout = async () => {
    await axiosPrivate.post('/auth/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('moduleCodes');
    localStorage.removeItem('modsInfo');
    authDispatch({ type: 'LOGOUT' });
    disconnectSocket();
    navigate('/login');
  };

  return { logout };
};
