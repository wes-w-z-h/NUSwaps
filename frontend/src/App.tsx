import Home from './views/Home.tsx';
import Login from './views/auth/Login.tsx';
import SignUp from './views/auth/SignUp.tsx';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={SignUp} />
      </Routes>
    </Router>
  );
};

export default App;
