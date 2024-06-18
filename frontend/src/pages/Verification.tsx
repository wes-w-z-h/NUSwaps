import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/auth/useAuthContext';
import { UserToken } from '../types/User';
import { axiosPublic } from '../util/api/axios';

const Verification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { authDispatch } = useAuthContext();

  const handleClick = async () => {
    await axiosPublic
      .get<UserToken>(`/auth/verify/${token}`)
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data.data));
        authDispatch({ type: 'LOGIN', payload: data.data });
        navigate('/dashboard');
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="Verification">
        <h2>VerificationPage</h2>
      </div>
      <div>
        <Button variant="outlined" onClick={handleClick}>
          Confirm Account
        </Button>
      </div>
    </>
  );
};

export default Verification;
