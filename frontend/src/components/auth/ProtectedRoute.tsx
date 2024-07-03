import { Outlet } from 'react-router-dom';
import { useVerifyToken } from '../../hooks/auth/useVerifyToken';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { verifyToken } = useVerifyToken();
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
