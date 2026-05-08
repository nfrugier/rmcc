import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Campaigns from './pages/Campaigns';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/campaigns" element={<Campaigns />} />
        </Routes>
      </Router>
  );
}

export default App;