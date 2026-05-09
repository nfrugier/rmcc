import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

type Tab = 'dashboard' | 'users' | 'campaigns' | 'characters';

export default function Admin() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [stats, setStats] = useState<{ totalUsers: number; totalCampaigns: number } | null>(null);    const [users, setUsers] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, u, c, ch] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/campaigns'),
                api.get('/admin/characters')
            ]);
            setStats(s.data);
            setUsers(u.data);
            setCampaigns(c.data);
            setCharacters(ch.data);
        } catch (err) {
            console.error("Erreur de chargement", err);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchData().then(r => (r)); }, []);

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            await api.patch(`/admin/users/${userId}/role`, { role: newRole });
            await fetchData();
        } catch (err) { alert(`Erreur rôle : ${err}`); }
    };

    const deleteItem = async (entity: string, id: string) => {
        if (!window.confirm(`Confirmer la suppression de cet élément (${entity}) ?`)) return;
        try {
            await api.delete(`/admin/${entity}/${id}`);
            await fetchData();
        } catch (err) { alert(`Erreur lors de la suppression : ${err}`); }
    };

    // --- STYLES ---
    const tabStyle = (id: Tab) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        borderBottom: activeTab === id ? '3px solid #007bff' : 'none',
        fontWeight: activeTab === id ? 'bold' : 'normal',
        color: activeTab === id ? '#007bff' : '#666',
    });

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Administration Rolemaster</h2>
                <button onClick={fetchData} disabled={loading}>{loading ? '...' : 'Actualiser'}</button>
            </div>

            {/* --- NAVIGATION PAR ONGLETS --- */}
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
                <div style={tabStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>Stats</div>
                <div style={tabStyle('users')} onClick={() => setActiveTab('users')}>Utilisateurs</div>
                <div style={tabStyle('campaigns')} onClick={() => setActiveTab('campaigns')}>Campagnes</div>
                <div style={tabStyle('characters')} onClick={() => setActiveTab('characters')}>Personnages</div>
            </div>

            {/* --- CONTENU DES ONGLETS --- */}

            {activeTab === 'dashboard' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div style={cardStyle}><h3>Membres</h3><p>{stats?.totalUsers || 0}</p></div>
                    <div style={cardStyle}><h3>Aventures</h3><p>{stats?.totalCampaigns || 0}</p></div>
                    <div style={cardStyle}><h3>Héros</h3><p>{characters.length}</p></div>
                </div>
            )}

            {activeTab === 'users' && (
                <Table headers={['Email', 'Rôle', 'Actions']}>
                    {users.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{u.email}</td>
                            <td>
                                <select value={u.role} onChange={(e) => updateUserRole(u.id, e.target.value)}>
                                    <option value="PLAYER">PLAYER</option>
                                    <option value="GM">GM</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                            <td><button onClick={() => deleteItem('users', u.id)} style={btnDel}>Bannir</button></td>
                        </tr>
                    ))}
                </Table>
            )}

            {activeTab === 'campaigns' && (
                <Table headers={['Nom', 'GM', 'Options', 'Actions']}>
                    {campaigns.map((c) => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.gm?.email}</td>
                            <td>{JSON.stringify(c.options)}</td>
                            <td><button onClick={() => deleteItem('campaigns', c.id)} style={btnDel}>Supprimer</button></td>
                        </tr>
                    ))}
                </Table>
            )}

            {activeTab === 'characters' && (
                <Table headers={['Nom', 'Race', 'Profession', 'Joueur', 'Actions']}>
                    {characters.map((ch) => (
                        <tr key={ch.id}>
                            <td>{ch.name || 'Sans nom'}</td>
                            <td>{ch.race}</td>
                            <td>{ch.profession}</td>
                            <td>{ch.player?.email}</td>
                            <td><button onClick={() => deleteItem('characters', ch.id)} style={btnDel}>Supprimer</button></td>
                        </tr>
                    ))}
                </Table>
            )}
        </div>
    );
}

// Composants utilitaires pour le style
const cardStyle = { padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' as const, border: '1px solid #ddd' };
const btnDel = { background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const Table = ({ headers, children }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead><tr style={{ background: '#eee', textAlign: 'left' }}>
            {headers.map((h: string) => <th key={h} style={{ padding: '10px' }}>{h}</th>)}
        </tr></thead>
        <tbody>{children}</tbody>
    </table>
);