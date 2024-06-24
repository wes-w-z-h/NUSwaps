import { Outlet } from 'react-router-dom';
import { useVerifyToken } from '../../hooks/auth/useVerifyToken';

const ProtectedRoute = () => {
  const { verifyToken } = useVerifyToken();
  verifyToken();

  return (
    <div>
      <Outlet />;
    </div>
  );
};

export default ProtectedRoute;
