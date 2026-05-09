// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Campaigns from './pages/Campaigns';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';

// Un petit wrapper pour n'afficher la Navbar que si on n'est pas sur le Login
function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const showNavbar = location.pathname !== '/';
    return (
        <>
            {showNavbar && <Navbar />}
            {children}
        </>
    );
}

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/admin" element={<Admin />} />
                    {/* On pourra ajouter /gm ici plus tard */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;