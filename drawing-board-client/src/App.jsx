import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StateProvider } from './context/StateContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {

  return (
    <StateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </StateProvider>
  )
}

export default App
