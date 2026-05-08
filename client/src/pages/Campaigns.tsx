import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fonction pour récupérer la liste des campagnes
    const fetchCampaigns = async () => {
        try {
            const response = await api.get('/campaigns');
            setCampaigns(response.data);
        } catch (err) {
            // Si le token est expiré ou invalide, on force la déconnexion
            handleLogout();
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [navigate]);

    // 1. Fonction de Déconnexion
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // 2. Fonction de Création de Campagne
    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newCampaignName.trim()) return;

        try {
            // On envoie le payload attendu par le CreateCampaignDto du backend
            await api.post('/campaigns', {
                name: newCampaignName,
                // En V2, on pourra passer l'objet "options" ici grâce aux cases à cocher
            });

            // On vide le champ et on rafraîchit la liste
            setNewCampaignName('');
            fetchCampaigns();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la campagne');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            {/* --- BARRE DE NAVIGATION --- */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '2px solid #eee', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Rolemaster MVP</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {/* Retour Home (recharge le composant actuel puisqu'il s'agit de l'accueil connecté) */}
                    <button onClick={() => navigate('/campaigns')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Tableau de bord
                    </button>
                    {/* Bouton Déconnexion */}
                    <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Déconnexion
                    </button>
                </div>
            </nav>

            {/* --- SECTION CRÉATION DE CAMPAGNE --- */}
            <section style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0 }}>Créer une nouvelle campagne</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleCreateCampaign} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Nom de la campagne (ex: Ombres sur le monde)"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        required
                        style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                        Créer
                    </button>
                </form>
            </section>

            {/* --- SECTION LISTE DES CAMPAGNES --- */}
            <section>
                <h3>Mes Campagnes existantes</h3>
                {campaigns.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Aucune campagne pour le moment. Créez-en une ci-dessus !</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {campaigns.map((camp: any) => (
                            <li key={camp.id} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '18px' }}>{camp.name}</strong>
                                <span style={{ fontSize: '14px', color: '#888' }}>
                  Créée le {new Date(camp.created_at).toLocaleDateString()}
                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

        </div>
    );
}