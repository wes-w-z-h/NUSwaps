import React, { SetStateAction, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useEditUser from '../hooks/user/useEditUser';
import CustomAlert from '../components/CustomAlert';
import useDeleteUser from '../hooks/user/useDeleteUser';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/auth/useAuthContext';

const ProfilePage = () => {
  const initialState = {
    matchingPasswords: '',
    teleHandle: '',
  };
  const { authState } = useAuthContext();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teleHandle, setTeleHandle] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState(initialState);
  const { editUser, loading: loadingEdit, error: errorEdit } = useEditUser();

  useEffect(() => {
    if (authState.user?.telegramHandle) {
      setTeleHandle(authState.user.telegramHandle);
    }
  }, [authState.user]);

  const {
    deleteUser,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteUser();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (confirmPassword !== newPassword) {
      setFormError((prev) => ({
        ...prev,
        matchingPasswords:
          'New password and confirm password should be the same',
      }));

      if (teleHandle && !teleHandle.startsWith('@')) {
        setFormError((prev) => ({
          ...prev,
          teleHandle: "Telegram handle should start with '@'",
        }));
      }
      return;
    }

    await editUser(oldPassword, newPassword, teleHandle);
  };

  const handleDeleteAccount = async () => {
    deleteUser();
    setOpenDialog(false);
  };

  const handleChange = (setter: React.Dispatch<SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormError(initialState);
      setter(e.target.value);
    };
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      {errorEdit && <CustomAlert message={errorEdit} />}
      {errorDelete && <CustomAlert message={errorDelete} />}
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="oldPassword"
              label="Current Password"
              name="oldPassword"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={oldPassword}
              onChange={handleChange(setOldPassword)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={formError.matchingPasswords !== ''}
              helperText={formError.matchingPasswords}
              fullWidth
              id="newPassword"
              label="New Password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={handleChange(setNewPassword)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={formError.matchingPasswords !== ''}
              helperText={formError.matchingPasswords}
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              error={formError.teleHandle !== ''}
              helperText={formError.teleHandle}
              fullWidth
              id="teleHandle"
              label="Telegram handle (Optional)"
              name="teleHandle"
              type="text"
              value={teleHandle}
              onChange={handleChange(setTeleHandle)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loadingEdit || loadingDelete}
              sx={{ mt: 3, mb: 2 }}
            >
              Update Profile
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              disabled={loadingDelete || loadingEdit}
              sx={{ mt: 1 }}
              onClick={handleClickOpen}
            >
              Delete Account
            </Button>
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { borderRadius: 3, boxShadow: 24, p: 2 } }}
      >
        <DialogTitle id="alert-dialog-title">{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {}
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
