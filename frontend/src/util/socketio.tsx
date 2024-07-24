import { io } from 'socket.io-client';
import { UserToken } from '../types/User';
import { Bounce, toast, ToastOptions } from 'react-toastify';

const BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;

const toastOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Bounce,
};

export const connectSocket = (user: UserToken) => {
  const ws = io(BASE_BACKEND_URL);
  ws.on('connect', () => {
    ws?.emit('user-data', user);

    // Match event listeners
    ws.on('match-found', (swap) => {
      toast.success(
        `🎉🎉🎉 Match found for ${swap.courseId}-${swap.lessonType}!`,
        toastOptions
      );
    });

    ws.on('match-accepted', (swap) => {
      toast.success(
        ` 🎉🎉🎉 Match for ${swap.courseId}-${swap.lessonType} has been accepted by all parties!`,
        toastOptions
      );
    });

    ws.on('match-rejected', (swap) => {
      toast.warn(
        `Your match for ${swap.courseId}-${swap.lessonType} has been rejected`,
        toastOptions
      );
    });
  });

  return ws;
};
