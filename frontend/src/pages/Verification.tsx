import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/auth/useAuthContext';

const Verification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { authDispatch } = useAuthContext();

  const handleClick = async () => {
    await axios
      .get(`http://localhost:4000/api/auth/verify/${token}`)
      .then((data) => {
        authDispatch({ type: 'LOGIN', payload: data.data });
        navigate('/');
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
