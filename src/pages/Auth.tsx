import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Mail, Lock, User, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Muito Fraca', color: 'bg-destructive' },
      { strength: 2, label: 'Fraca', color: 'bg-orange-500' },
      { strength: 3, label: 'Média', color: 'bg-yellow-500' },
      { strength: 4, label: 'Forte', color: 'bg-blue-500' },
      { strength: 5, label: 'Muito Forte', color: 'bg-green-500' },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast({
            title: 'Login realizado!',
            description: 'Bem-vindo de volta.',
          });
          navigate('/dashboard');
        } else {
          toast({
            title: 'Erro ao fazer login',
            description: 'Email ou senha incorretos.',
            variant: 'destructive',
          });
        }
      } else {
        if (password !== confirmPassword) {
          toast({
            title: 'Erro no cadastro',
            description: 'As senhas não coincidem.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        toast({
          title: 'Cadastro realizado!',
          description: 'Sua conta foi criada com sucesso.',
        });
        setIsLogin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px] space-y-6 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-primary transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center lg:text-left animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <h2 className="text-3xl font-bold mb-2 transition-all duration-300">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground text-sm transition-all duration-300">
              {isLogin
                ? 'Please Sign In to continue'
                : 'Fill in the details to get started'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            {!isLogin && (
              <>
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 transition-all duration-300 focus:scale-[1.01]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="document" className="text-foreground">Documento</Label>
                  <div className="relative group">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="document"
                      type="text"
                      placeholder="CPF ou CNPJ"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      className="pl-10 h-11 transition-all duration-300 focus:scale-[1.01]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-11 transition-all duration-300 focus:scale-[1.01]"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 transition-all duration-300 focus:scale-[1.01]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 transition-all duration-300 focus:scale-[1.01]"
                  required
                />
              </div>
              
              {!isLogin && password && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs text-muted-foreground">
                      Força: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="confirmPassword" className="text-foreground">Repetir Senha</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 transition-all duration-300 focus:scale-[1.01]"
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">As senhas não coincidem</p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2" 
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot Password
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 gradient-primary shadow-primary text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/50 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center text-sm pt-2 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <span className="text-muted-foreground">
              {isLogin ? 'Not a member?' : 'Already have an account?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-semibold transition-all duration-200 hover:scale-105 inline-block"
            >
              {isLogin ? 'Register Now' : 'Sign In'}
            </button>
          </div>

          {/* Demo credentials - only show on login */}
          {isLogin && (
            <div className="pt-6 border-t border-border animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <p className="text-xs text-muted-foreground mb-3 font-medium">
                Demo credentials:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted hover:scale-[1.01] cursor-pointer">
                  <span className="text-muted-foreground">Admin:</span>
                  <span className="font-mono text-foreground">admin@pabx.com / admin123</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted hover:scale-[1.01] cursor-pointer">
                  <span className="text-muted-foreground">Revenda:</span>
                  <span className="font-mono text-foreground">revenda@telecom.com / reseller123</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted hover:scale-[1.01] cursor-pointer">
                  <span className="text-muted-foreground">User:</span>
                  <span className="font-mono text-foreground">usuario@empresa.com / user123</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(262,83%,58%)]">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djEyaDEyVjM0SDM2em0wLTEyVjEwaDEydjEySDM2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        
        {/* Content - Login View */}
        {isLogin && (
          <div className="relative z-10 flex items-center justify-center w-full p-12 text-white animate-fade-in">
            <div className="max-w-md space-y-8 text-center">
              {/* Icon/Illustration placeholder */}
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Lock shield illustration - simplified */}
                  <div className="relative">
                    {/* Shield background */}
                    <div className="w-48 h-56 rounded-[40px] bg-gradient-to-br from-[hsl(262,83%,25%)] to-[hsl(239,84%,35%)] shadow-2xl flex items-center justify-center border-4 border-[hsl(45,100%,60%)]">
                      {/* Lock icon */}
                      <div className="w-24 h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-14 h-14 text-white" />
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite]">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="absolute -bottom-4 -left-8 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                      <div className="text-2xl">🔒</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Secure Access to Your PABX System
                </h2>
                <p className="text-lg text-white/80">
                  Manage your calls, agents, and reports with enterprise-grade security and reliability.
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">99.9%</div>
                  <div className="text-sm text-white/70">Uptime</div>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-white/70">Support</div>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-white/70">Clients</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content - Register View */}
        {!isLogin && (
          <div className="relative z-10 flex items-center justify-center w-full p-12 text-white animate-fade-in">
            <div className="max-w-md space-y-8 text-center">
              {/* Icon/Illustration placeholder */}
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* User creation illustration */}
                  <div className="relative">
                    {/* Circle background */}
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[hsl(262,83%,25%)] to-[hsl(239,84%,35%)] shadow-2xl flex items-center justify-center border-4 border-[hsl(45,100%,60%)]">
                      {/* User icon */}
                      <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <User className="w-14 h-14 text-white" />
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite]">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                      <Phone className="w-8 h-8 text-white" />
                    </div>

                    <div className="absolute top-1/2 -right-8 w-14 h-14 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Join Our PABX Platform
                </h2>
                <p className="text-lg text-white/80">
                  Create your account and start managing your communications with powerful tools and features.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm font-medium">Fast Setup</div>
                  <div className="text-xs text-white/70">Ready in minutes</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl mb-2">🔐</div>
                  <div className="text-sm font-medium">Secure</div>
                  <div className="text-xs text-white/70">Bank-level security</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Analytics</div>
                  <div className="text-xs text-white/70">Real-time insights</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-sm font-medium">Support</div>
                  <div className="text-xs text-white/70">24/7 assistance</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
