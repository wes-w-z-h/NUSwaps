import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      limit={2}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  );
};

export { Notification };
