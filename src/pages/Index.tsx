
import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import IntroAnimation from '@/components/IntroAnimation';
import { ToastProvider } from '@/contexts/ToastContext';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john.doe@example.com' });

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate credentials with Firebase Auth
    console.log('Login attempt:', email, password);
    setUser({ name: 'John Doe', email });
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    // Handle signup logic
    console.log('Signup clicked');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ name: '', email: '' });
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroAnimation onAnimationComplete={handleIntroComplete} />;
  }

  return (
    <ToastProvider>
      {isLoggedIn ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LandingPage onLogin={handleLogin} onSignup={handleSignup} />
      )}
    </ToastProvider>
  );
};

export default Index;
