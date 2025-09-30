import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StateProvider } from './context/StateContext';
import { AuthStateProvider } from './context/AuthContext';

import Home from './pages/Home';
import FilePage from './pages/FilePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Functionality from './components/Functionality';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/partials/ProtectedRoute';

function App() {

  return (
    <StateProvider>
      <AuthStateProvider>
        <Router>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/file/:id" element={ <ProtectedRoute><FilePage /></ProtectedRoute> } />
            <Route path="/view" element={ <ProtectedRoute><FilePage /><Functionality /></ProtectedRoute> } />
            <Route path="/view/chat" element={ <ProtectedRoute><FilePage /><Functionality /></ProtectedRoute> } />
            <Route path="/view/user" element={ <ProtectedRoute><FilePage /><Functionality /></ProtectedRoute> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/signup" element={ <Signup /> } />
            <Route path="/dashboard" element={ <ProtectedRoute><DashboardPage /></ProtectedRoute> } />
          </Routes>
        </Router>
      </AuthStateProvider>
    </StateProvider>
  )
}

export default App