import { useState, useEffect } from 'react';
import { getCurrentUser , User} from '../api/authService.js';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}



export function useAuth() : AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Mocking auth load

     let isMounted = true;
     async function checkAuth() {
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          // data est déjà correctement typé comme (User | null) 
          // grâce à authService.ts
          setUser(data); 
        }
      } catch (error) {
        console.error("Erreur d'authentification", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    checkAuth();

    return () => { 
      isMounted = false; 
    };

  }, []);

  return { user, isLoading };
}



