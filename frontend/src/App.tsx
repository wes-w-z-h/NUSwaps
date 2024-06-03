import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext.tsx';

const App = () => {
  const { state } = useAuthContext();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={state.user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={state.user ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
    </Router>
  );
};

export default App;
