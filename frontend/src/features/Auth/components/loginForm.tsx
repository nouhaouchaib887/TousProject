import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';
import { Lock, User, Terminal } from 'lucide-react';
import { loginUser } from '../api/authService.js';
import { toast } from 'sonner';


interface FormData {
  userName: string;
  password: string;
}
export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    password: '',
  });
   const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";


  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

   const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.userName) {
      newErrors.userName = "Nom d'utilisateur est requis";
    } 
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setApiError(null); 
    setIsLoading(true);
  
    console.log("Submit cliqué");
    try {
      const data = await loginUser(formData.userName, formData.password);
      navigate(from, { replace: true });
      console.log("Connexion réussie", data);
      // Ici vous ferez probablement une redirection, par exemple :
      // navigate('/dashboard');
    } catch (err) {
      
        toast.error("Identifiants incorrects");
        setIsLoading(false);
    }
  }; 

  return (

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                Nom d'utilisateur
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                <Input
                  id="username"
                  type="text"
                  placeholder="admin, user, topographe..."
                  value={formData.userName}
                  onChange={handleChange('userName')}
                  className="pl-10 h-12 bg-muted/50 border-border focus:bg-background transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass" className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                Mot de passe 
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                <Input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-muted/50 border-border focus:bg-background transition-all rounded-xl"
                onChange={handleChange('password')}
                
                  value={formData.password}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Se souvenir de moi</span>
            </label>
          </div>

        


            <Button 
              type="submit" 
              className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-brand-500/20 rounded-xl"
              disabled={isLoading || !formData.userName.trim() || !formData.password.trim()}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
  );
}
