import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import IntroAnimation from '@/components/IntroAnimation';
import { ToastProvider } from '@/contexts/ToastContext';
import { authenticateUser, createUser } from '@/services/database';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const userData = await authenticateUser(email, password);
      
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        // Handle login failure
        console.log('Login failed: Invalid credentials');
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      const userId = await createUser(email, password, name);
      const userData = { id: userId, name, email };
      
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroAnimation onAnimationComplete={handleIntroComplete} />;
  }

  return (
    <ToastProvider>
      {isLoggedIn && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LandingPage onLogin={handleLogin} onSignup={handleSignup} />
      )}
    </ToastProvider>
  );
};

export default Index;
