import React, { SetStateAction, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Copyright from '../components/auth/Copyright';
import { useLogin } from '../hooks/auth/useLogin';
import validateFormInput from '../util/auth/validateFormInput';
import CustomAlert from '../components/CustomAlert';

const Login = () => {
  const initialState = { email: '', password: '' };
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState(initialState);
  const { login, loading, error } = useLogin();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputErrors = validateFormInput(email, password);
    console.log(inputErrors);
    setFormError(inputErrors);

    if (inputErrors.email !== '' || inputErrors.password !== '') {
      return;
    }

    await login(email, password);
  };

  const handleChange = (setter: React.Dispatch<SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormError(initialState);
      setter(e.target.value);
    };
  };

  return (
    <>
      {error && <CustomAlert message={error} />}
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                autoFocus
                required
                fullWidth
                margin="normal"
                name="email"
                label="Email (@u.nus.edu)"
                id="email"
                autoComplete="email"
                value={email}
                onChange={handleChange(setEmail)}
              />
              <Typography className="error-message">
                {formError.email}
              </Typography>
              <TextField
                required
                fullWidth
                margin="normal"
                name="password"
                label="Password"
                id="password"
                type="password"
                autoComplete="password"
                value={password}
                onChange={handleChange(setPassword)}
              />
              <Typography className="error-message">
                {formError.password}
              </Typography>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* TODO: add a forget password function */}
                  <Link component={RouterLink} variant="body2" to="/">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} variant="body2" to="/signup">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              <Copyright />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
