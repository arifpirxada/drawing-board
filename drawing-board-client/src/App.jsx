import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StateProvider } from './context/StateContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Functionality from './components/Functionality';
import Dashboard from './components/dashboard/Dashboard';

function App() {

  return (
    <StateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view" element={<><Home /><Functionality /></>} />
          <Route path="/view/chat" element={<><Home /><Functionality /></>} />
          <Route path="/view/user" element={<><Home /><Functionality /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </StateProvider>
  )
}

export default App
