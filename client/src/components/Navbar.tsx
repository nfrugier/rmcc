import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Logique de visibilité : l'ADMIN voit tout, le GM voit GM+PLAYER
    const canSeeAdmin = role === 'ADMIN';
    const canSeeGM = role === 'ADMIN' || role === 'GM';
    const canSeePlayer = true; // Tout le monde est au moins un joueur

    const navItemStyle = (path: string) => ({
        padding: '10px 15px',
        cursor: 'pointer',
        backgroundColor: location.pathname === path ? '#007bff' : 'transparent',
        color: location.pathname === path ? 'white' : 'black',
        border: 'none',
        borderRadius: '4px',
        fontWeight: location.pathname === path ? 'bold' : 'normal',
    });

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            background: '#f1f1f1',
            borderBottom: '1px solid #ccc',
            marginBottom: '20px'
        }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <strong style={{ marginRight: '15px', alignSelf: 'center' }}>RMCC</strong>

                {canSeePlayer && (
                    <button style={navItemStyle('/campaigns')} onClick={() => navigate('/campaigns')}>
                        Campagnes
                    </button>
                )}

                {canSeeGM && (
                    <button style={navItemStyle('/gm')} onClick={() => navigate('/gm')}>
                        Maître de Jeu
                    </button>
                )}

                {canSeeAdmin && (
                    <button style={navItemStyle('/admin')} onClick={() => navigate('/admin')}>
                        Admin
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{user.email} ({role})</span>
                <button
                    onClick={handleLogout}
                    style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Déconnexion
                </button>
            </div>
        </nav>
    );
}