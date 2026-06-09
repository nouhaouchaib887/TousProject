import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';
import { Lock, User, Terminal } from 'lucide-react';
import LoginForm  from '../features/Auth/components/loginForm';

export default function LoginPage() {
  const location = useLocation();


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-[400px] p-8 space-y-8 border-border bg-card shadow-xl rounded-3xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-brand-50 text-accent-green rounded-2xl mb-2">
              <Terminal size={32} />
            </div>
            <h1 className="text-2xl font-semibold text-foreground uppercase tracking-tight">PiloTop</h1>
            <p className="text-muted-foreground text-sm font-medium">Gestion Topographique & Foncière</p>
          </div>

          <LoginForm />

          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest pt-4">
              Version 1.0.0 Alpha
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
