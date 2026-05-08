import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });

            // Sauvegarde du token et des infos user
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirection vers le tableau de bord des campagnes
            navigate('/campaigns');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Connexion</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    placeholder="Email (ex: mj@rolemaster.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}