import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (error) {
      toast.error('Falha no login. Verifique suas credenciais.');
    } else {
      toast.success('Login realizado com sucesso!');
      
      // Verificar se há um share pendente
      const pendingShareStr = sessionStorage.getItem('pendingShare');
      if (pendingShareStr) {
        try {
          const pendingShare = JSON.parse(pendingShareStr);
          console.log('📱 Recovering pending share:', pendingShare);
          
          // Salvar no localStorage para a página de vídeos
          if (pendingShare.url) {
            localStorage.setItem('sharedVideoUrl', pendingShare.url);
            if (pendingShare.title) {
              localStorage.setItem('sharedVideoTitle', pendingShare.title);
            }
          }
          
          // Limpar dados temporários
          sessionStorage.removeItem('pendingShare');
          
          // Redirecionar para vídeos
          toast.info('Processando vídeo compartilhado...');
          navigate('/videos', { replace: true });
          return;
        } catch (e) {
          console.error('Error recovering pending share:', e);
        }
      }
      
      // Se não houver share pendente, ir para home
      navigate('/', { replace: true });
    }
  };

  return (
    <motion.div 
      className="flex min-h-[calc(100vh-65px)] items-center justify-center p-4 relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50" />
      <Card className="mx-auto max-w-sm w-full glass border-border/50 shadow-glow relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">Login</CardTitle>
          <CardDescription>
            Entre com seu email para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-sm underline hover:text-primary">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link to="/signup" className="underline hover:text-primary">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
