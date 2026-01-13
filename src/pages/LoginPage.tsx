import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const coupleName = import.meta.env.VITE_COUPLE_NAME;
  const weddingDate = import.meta.env.VITE_WEDDING_DATE;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
      setLoading(false);
    } else {
      toast({
        title: "Welcome back",
        description: "You have successfully signed in.",
      });
      navigate('/'); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* 1. Custom Styles for Fonts and Animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .font-great-vibes { font-family: 'Great Vibes', cursive; }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            opacity: 0; 
            animation: fadeIn 3s ease-out forwards;
            animation-delay: 1s; /* 1 second delay for Sarah & Samad */
          }

          .animate-fade-slide-up {
            opacity: 0; 
            animation: fadeSlideUp 1.5s ease-out forwards;
            animation-delay: 1.8s; /* Starts as the name is mid-fade */
          }
        `}
      </style>

      {/* 2. Animated Header Section */}
      <div className="text-center mb-8 space-y-1">
        <h1 className="font-great-vibes text-5xl md:text-6xl text-gray-800 text-heading animate-fade-in">
          {coupleName}
        </h1>
        <p className="text-sm md:text-base text-muted-theme font-sans uppercase tracking-[0.2em] text-gray-500 font-medium animate-fade-slide-up">
          {weddingDate}
        </p>
      </div>

      {/* 3. The Login Card */}
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader className="text-center text-heading">
          <CardTitle>Your RSVP Dashboard</CardTitle>
          <CardDescription>Sign in to manage your guest list.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-heading font-medium text-left block">Email</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-heading font-medium">Password</label>
              </div>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}