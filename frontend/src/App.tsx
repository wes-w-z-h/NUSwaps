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
import { useAuthContext } from './hooks/auth/useAuthContext.tsx';
import Verification from './pages/Verification.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

const App = () => {
  const { authState } = useAuthContext();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify/:token" element={<Verification />} />
        <Route
          path="/profile"
          element={
            localStorage.getItem('user') ? (
              <ProfilePage />
            ) : (
              <Navigate to={'/'} />
            )
          }
        />
        <Route
          path="/login"
          element={authState.user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authState.user ? <Navigate to="/" /> : <SignUp />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            // TODO: find a better way to handle the locking of routes issue with authState.user is that
            // useEffect runs after so refreshing a page checks the authState before its been updated
            element={
              // localStorage.getItem('user') ? <Dashboard /> : <Navigate to="/" />
              <Dashboard />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
