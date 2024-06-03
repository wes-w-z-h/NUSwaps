import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Copyright from '../components/auth/Copyright.tsx';
import { ErrorResponse } from '../types/ErrorResponse.tsx';
import { useSignup } from '../hooks/useSignup.tsx';

const SignUp = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [cfmPassword, setCfmPassword] = useState<string>('');
  const [formError, setFormError] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { signup, loading, error } = useSignup();

  const validateFormInput = () => {
    // Initialise object to track errors
    const inputErrors = {
      username: '',
      password: '',
      confirmPassword: '',
    };

    // Check empty username or password
    if (!username) {
      inputErrors.username = 'Username should not be empty';
    }
    if (!password) {
      inputErrors.password = 'Password should not be empty';
    }
    // Check matching passwords
    if (password !== cfmPassword) {
      inputErrors.confirmPassword =
        'Password and Confirm Password should be the same';
    }

    return inputErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputErrors = validateFormInput();
    setFormError(inputErrors);

    if (
      inputErrors.username !== '' ||
      inputErrors.password !== '' ||
      inputErrors.confirmPassword !== ''
    ) {
      return;
    }

    await signup(username, password);
  };

  const errRes = error.response as ErrorResponse;

  return (
    <>
      {error.message && (
        <Alert severity="error" className="error">
          {error.message + ': ' + errRes.data.error}
        </Alert>
      )}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  margin="normal"
                  name="username"
                  label="Username"
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Typography className="error-message">
                  {formError.username}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Typography className="error-message">
                  {formError.password}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  value={cfmPassword}
                  onChange={(e) => setCfmPassword(e.target.value)}
                />
                <Typography className="error-message">
                  {formError.confirmPassword}
                </Typography>
              </Grid>
            </Grid>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} variant="body2" to="/login">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </>
  );
};

export default SignUp;
