import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/auth/useAuthContext';
import { UserToken } from '../types/User';

const Verification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { authDispatch } = useAuthContext();

  const handleClick = async () => {
    await axios
      .get<UserToken>(`http://localhost:4000/api/auth/verify/${token}`)
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
