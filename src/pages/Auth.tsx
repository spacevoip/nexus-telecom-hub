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
              {/* VOIP Network Illustration */}
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* Central Server/Hub */}
                    <div className="relative z-10">
                      <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-lg flex items-center justify-center border-2 border-white/40 shadow-2xl">
                        <div className="relative">
                          <Phone className="w-20 h-20 text-white" />
                          {/* Rotating signal rings */}
                          <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                          <div className="absolute inset-2 border-2 border-white/20 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                        </div>
                      </div>
                      
                      {/* Multiple Pulse rings with different speeds */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-white/50 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute -inset-2 rounded-3xl border-2 border-white/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
                      <div className="absolute -inset-4 rounded-3xl border-2 border-white/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.6s' }} />
                    </div>

                    {/* Orbiting Devices around the center */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                      const radius = 130;
                      const x = Math.cos((angle * Math.PI) / 180) * radius;
                      const y = Math.sin((angle * Math.PI) / 180) * radius;
                      
                      const icons = [Phone, Phone, Phone, Phone, Phone, Phone];
                      const IconComponent = icons[i];
                      
                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          }}
                        >
                          <div 
                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg animate-[bounce_3s_ease-in-out_infinite]"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          {/* Individual pulse for each device */}
                          <div 
                            className="absolute inset-0 rounded-xl border border-white/40 animate-ping"
                            style={{ animationDuration: '2s', animationDelay: `${i * 0.3}s` }}
                          />
                        </div>
                      );
                    })}

                    {/* Animated Connection Lines */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                      const radius = 130;
                      const x = Math.cos((angle * Math.PI) / 180) * radius;
                      const y = Math.sin((angle * Math.PI) / 180) * radius;
                      const lineLength = Math.sqrt(x * x + y * y);
                      const lineAngle = Math.atan2(y, x) * (180 / Math.PI);
                      
                      return (
                        <div
                          key={`line-${i}`}
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                        >
                          <div
                            className="h-0.5 bg-gradient-to-r from-white/50 via-white/30 to-transparent origin-left"
                            style={{
                              width: `${lineLength - 70}px`,
                              transform: `rotate(${lineAngle}deg)`,
                            }}
                          >
                            {/* Animated dot traveling along the line */}
                            <div 
                              className="w-2 h-2 bg-white rounded-full absolute top-1/2 -translate-y-1/2 shadow-lg shadow-white/50"
                              style={{
                                animation: `slideRight 2s ease-in-out infinite`,
                                animationDelay: `${i * 0.3}s`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Floating Signal Strength Indicators */}
                    <div className="absolute top-2 right-4 animate-[bounce_2.5s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}>
                      <div className="flex gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20">
                        {[1, 2, 3, 4].map((bar) => (
                          <div 
                            key={bar}
                            className="w-1 bg-gradient-to-t from-green-400 to-green-200 rounded-full animate-pulse"
                            style={{ 
                              height: `${bar * 3 + 6}px`,
                              animationDelay: `${bar * 0.1}s`,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Floating Quality Badge */}
                    <div className="absolute bottom-4 left-4 animate-[bounce_2.8s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>
                      <div className="bg-white/15 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">HD Quality</span>
                      </div>
                    </div>

                    {/* Floating Icons */}
                    <div className="absolute top-8 left-6 text-3xl animate-[bounce_3.2s_ease-in-out_infinite] opacity-90" style={{ animationDelay: '0.8s' }}>
                      🎧
                    </div>

                    <div className="absolute bottom-12 right-8 text-2xl animate-[bounce_2.6s_ease-in-out_infinite] opacity-80" style={{ animationDelay: '1.1s' }}>
                      📞
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight">
                  Plataforma VOIP Inteligente
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Conecte, gerencie e monitore suas chamadas em tempo real com tecnologia de ponta e qualidade HD.
                </p>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold mb-1">10k+</div>
                  <div className="text-xs text-white/70">Chamadas/dia</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold mb-1">99.9%</div>
                  <div className="text-xs text-white/70">Qualidade HD</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-xs text-white/70">Disponível</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content - Register View */}
        {!isLogin && (
          <div className="relative z-10 flex items-center justify-center w-full p-12 text-white animate-fade-in">
            <div className="max-w-md space-y-8 text-center">
              {/* Network Building Illustration */}
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* Central User Avatar Being Created */}
                    <div className="relative z-10">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-lg flex items-center justify-center border-2 border-white/40 shadow-2xl">
                        <User className="w-16 h-16 text-white" />
                      </div>
                      
                      {/* Assembly animation rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/40 animate-spin" style={{ animationDuration: '10s' }} />
                      <div className="absolute -inset-4 rounded-full border-2 border-dotted border-white/30 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
                    </div>

                    {/* Form Elements Orbiting */}
                    {[
                      { icon: Mail, angle: 0, emoji: '📧' },
                      { icon: Phone, angle: 72, emoji: '📱' },
                      { icon: FileText, angle: 144, emoji: '📄' },
                      { icon: Lock, angle: 216, emoji: '🔐' },
                      { icon: User, angle: 288, emoji: '👤' },
                    ].map((item, i) => {
                      const radius = 110;
                      const x = Math.cos((item.angle * Math.PI) / 180) * radius;
                      const y = Math.sin((item.angle * Math.PI) / 180) * radius;
                      const IconComponent = item.icon;
                      
                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          }}
                        >
                          {/* Icon container */}
                          <div 
                            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg animate-[bounce_3s_ease-in-out_infinite]"
                            style={{ animationDelay: `${i * 0.3}s` }}
                          >
                            <IconComponent className="w-7 h-7 text-white" />
                            
                            {/* Check mark appearing animation */}
                            <div 
                              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs animate-[scale-in_0.5s_ease-out_infinite]"
                              style={{ 
                                animationDelay: `${i * 0.5 + 2}s`,
                                animationIterationCount: 'infinite'
                              }}
                            >
                              ✓
                            </div>
                          </div>
                          
                          {/* Pulse effect */}
                          <div 
                            className="absolute inset-0 rounded-2xl border border-white/40 animate-ping"
                            style={{ animationDuration: '2s', animationDelay: `${i * 0.4}s` }}
                          />
                          
                          {/* Emoji floating above */}
                          <div 
                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-[bounce_2s_ease-in-out_infinite]"
                            style={{ animationDelay: `${i * 0.25}s` }}
                          >
                            {item.emoji}
                          </div>
                        </div>
                      );
                    })}

                    {/* Connection Lines forming */}
                    {[0, 72, 144, 216, 288].map((angle, i) => {
                      const radius = 110;
                      const x = Math.cos((angle * Math.PI) / 180) * radius;
                      const y = Math.sin((angle * Math.PI) / 180) * radius;
                      const lineLength = Math.sqrt(x * x + y * y);
                      const lineAngle = Math.atan2(y, x) * (180 / Math.PI);
                      
                      return (
                        <div
                          key={`line-${i}`}
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                        >
                          {/* Building line animation */}
                          <div
                            className="h-1 bg-gradient-to-r from-white/60 via-white/40 to-transparent origin-left"
                            style={{
                              width: `${lineLength - 64}px`,
                              transform: `rotate(${lineAngle}deg)`,
                              animation: 'expandWidth 2s ease-out infinite',
                              animationDelay: `${i * 0.4}s`
                            }}
                          />
                        </div>
                      );
                    })}

                    {/* Building Progress Indicator */}
                    <div className="absolute top-4 right-4 animate-fade-in">
                      <div className="bg-white/15 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">Criando conta...</span>
                      </div>
                    </div>

                    {/* Feature badges floating */}
                    <div className="absolute bottom-6 left-6 animate-[bounce_3s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}>
                      <div className="bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-green-400/30 text-xs font-medium flex items-center gap-1">
                        ⚡ Setup Rápido
                      </div>
                    </div>

                    <div className="absolute top-8 left-8 animate-[bounce_2.7s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }}>
                      <div className="bg-purple-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-purple-400/30 text-xs font-medium flex items-center gap-1">
                        🔐 Seguro
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight">
                  Junte-se à Revolução VOIP
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Crie sua conta e comece a gerenciar suas comunicações com ferramentas poderosas e recursos avançados.
                </p>
              </div>

              {/* Enhanced Benefits Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-sm font-semibold mb-1">Setup Instantâneo</div>
                  <div className="text-xs text-white/70">Pronto em 2 minutos</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl mb-2">🔐</div>
                  <div className="text-sm font-semibold mb-1">Ultra Seguro</div>
                  <div className="text-xs text-white/70">Criptografia total</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm font-semibold mb-1">Analytics Pro</div>
                  <div className="text-xs text-white/70">Insights em tempo real</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl mb-2">💬</div>
                  <div className="text-sm font-semibold mb-1">Suporte VIP</div>
                  <div className="text-xs text-white/70">Assistência 24/7</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
