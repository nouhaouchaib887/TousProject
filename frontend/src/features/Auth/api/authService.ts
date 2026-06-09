// ==========================================
// 1. DÉFINITION DES TYPES (INTERFACES)
// ==========================================

export interface Session {
    id: number;
    session_token: string;
    ip_address: string;
    user_agent: string;
    created_at: string; // Date ISO
    is_active: boolean;
}

export interface User {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    session: Session;
    must_change_password: boolean;
}


// ==========================================
// 2. CONFIGURATION ET CONSTANTES
// ==========================================

const API_URL = "http://localhost:8000/api/v1";

// ==========================================
// 3. SERVICES D'AUTHENTIFICATION
// ==========================================

/**
 * Connecte un utilisateur et récupère la session complète
 * @param  userName
 * @param  password
 * @returns {Promise<LoginResponse>} <-- Retourne User + Session + Message
 */
export async function loginUser(userName: string, password: string): Promise<LoginResponse>{
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password: password })
    });

    const data = await response.json();
    
    if (!response.ok) {
        // On lance une erreur pour la rattraper dans le "catch" du composant
        throw new Error(data.detail || "Erreur de connexion");
    }
    localStorage.setItem('session_token', data.session.session_token);
    return data; // Retourne l'objet complet (user, session, etc.)
}

/**
 * Récupère l'utilisateur courant en utilisant le token stocké
 * @returns {Promise<User | null>} <-- Ici, on utilise l'interface définie dans auth.types.js
 */
// Fonction qui récupère l'utilisateur courant en utilisant le token stocké
export async function getCurrentUser() : Promise<User | null>  {
    const token = localStorage.getItem('session_token');
    
    // Si pas de token, on ne perd pas de temps à appeler le backend
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/me`, { // Ou l'URL que vous avez en backend
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
        });

        if (!response.ok) {
            localStorage.removeItem('session_token'); // Token invalide ? On nettoie.
            return null;
        }

        const data = await response.json();
        return data; // Retourne l'utilisateur { id, username, firstname, ... }
    } catch (error) {
        return null;
    }
}

export async function logout(navigateFn?: (path: string) => void): Promise<void> {
    localStorage.removeItem('session_token');
    localStorage.removeItem('session_token');
    
    if (navigateFn) {
        // Si vous passez la fonction navigate (ex: React Router)
        navigateFn("/login");
    } else {
        // Fallback natif si aucune fonction n'est fournie
        window.location.href = "/login";
    }
}