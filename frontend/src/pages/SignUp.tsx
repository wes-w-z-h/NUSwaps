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
import Copyright from '../components/auth/Copyright.tsx';
import { useSignup } from '../hooks/auth/useSignup.tsx';
import validateFormInput from '../util/auth/validateFormInput.ts';
import CustomAlert from '../components/CustomAlert.tsx';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [cfmPassword, setCfmPassword] = useState<string>('');
  const [teleHandle, setTeleHandle] = useState<string>('');
  const [formError, setFormError] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    teleHandle: '',
  });

  const { signup, loading, error, message } = useSignup();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputErrors = validateFormInput(
      email,
      password,
      cfmPassword,
      teleHandle
    );
    setFormError(inputErrors);

    if (
      inputErrors.email !== '' ||
      inputErrors.password !== '' ||
      inputErrors.confirmPassword !== '' ||
      inputErrors.teleHandle !== ''
    ) {
      return;
    }

    await signup(email, password, teleHandle);
  };

  return (
    <>
      {error && <CustomAlert message={error} />}
      {message && <CustomAlert message={message} severity="info" />}
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
                  name="email"
                  label="Email (@u.nus.edu)"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Typography className="error-message">
                  {formError.email}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="teleHandle"
                  label="Telegram handle (Optional)"
                  type="text"
                  id="teleHandle"
                  value={teleHandle}
                  onChange={(e) => setTeleHandle(e.target.value)}
                />
                <Typography className="error-message">
                  {formError.teleHandle}
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
