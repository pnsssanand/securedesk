import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Shield, Lock, Key, FileText, CreditCard, Building2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface LandingPageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    acceptTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!formData.email || !formData.password) {
        showError('Missing Information', 'Please enter both email and password');
        return;
      }
      
      onLogin(formData.email, formData.password);
    } else {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        showError('Missing Information', 'Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        showError('Password Mismatch', 'Passwords do not match');
        return;
      }
      
      if (!formData.acceptTerms) {
        showError('Terms Required', 'Please accept the Terms of Service');
        return;
      }
      
      // Use the user's email as the name if no name is provided
      const name = formData.email.split('@')[0];
      onSignup(formData.email, formData.password, name);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      showInfo('Email Required', 'Please enter your email address first');
      return;
    }
    showInfo('Recovery Email Sent', 'Password recovery instructions sent to your email');
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'bg-red-500', width: '25%' };
    if (password.length < 10) return { strength: 'medium', color: 'bg-yellow-500', width: '50%' };
    if (password.length < 12) return { strength: 'good', color: 'bg-blue-500', width: '75%' };
    return { strength: 'strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 security-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/3 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/2 rounded-full animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding and features */}
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Secure<span className="text-blue-300">Desk</span>
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-lg">
              Securing Your Digital Life, One Password at a Time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold text-white">Secure Vault</h3>
              <p className="text-sm text-blue-100">End-to-end encrypted password storage</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold text-white">Card Manager</h3>
              <p className="text-sm text-blue-100">Safely store your payment cards</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold text-white">Documents</h3>
              <p className="text-sm text-blue-100">Organize important documents</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold text-white">Bank Details</h3>
              <p className="text-sm text-blue-100">Secure banking information</p>
            </div>
          </div>
        </div>

        {/* Right side - Login/Signup form */}
        <div className="w-full max-w-md mx-auto animate-slide-up">
          <Card className="glass-card border-white/20">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {isLogin 
                  ? 'Sign in to access your secure vault' 
                  : 'Join thousands of users securing their digital life'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    {isLogin ? 'Password' : 'Master Password'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "Enter your password" : "Create a strong master password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {!isLogin && formData.password && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-white/70">
                        <span>Password Strength</span>
                        <span className="capitalize">{passwordStrength.strength}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your master password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: !!checked }))}
                        className="border-white/30 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="remember" className="text-sm text-white/70">Remember me</Label>
                    </div>
                    <Button 
                      type="button"
                      variant="link" 
                      className="text-blue-300 hover:text-blue-200 p-0 h-auto"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: !!checked }))}
                      className="border-white/30 data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="terms" className="text-sm text-white/70">
                      I accept the <Button variant="link" className="text-blue-300 hover:text-blue-200 p-0 h-auto">Terms of Service</Button>
                    </Label>
                  </div>
                )}

                <Button type="submit" className="w-full bg-white text-blue-900 hover:bg-white/90 font-semibold">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/70">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <Button 
                    type="button"
                    variant="link" 
                    className="text-blue-300 hover:text-blue-200 p-0 ml-1 h-auto"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              Designed & Developed with 💻 and ❤️ by Mr. Anand Pinisetty
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


