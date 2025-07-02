import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Key, 
  CreditCard, 
  FileText, 
  Building2, 
  Settings, 
  User, 
  Plus,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import VaultSection from './VaultSection';
import CardsSection from './CardsSection';
import DocumentsSection from './DocumentsSection';
import BankDetailsSection from './BankDetailsSection';
import SettingsSection from './SettingsSection';

interface DashboardProps {
  user: { id: string; name: string; email: string; };
  onLogout: () => void;
}

// Define types for section components used in the dashboard
interface SectionProps {
  user: { id: string; name: string; email: string; };
}

interface SettingsSectionProps extends SectionProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('vault');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    passwords: 0,
    cards: 0,
    documents: 0,
    banks: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  const menuItems = [
    { id: 'vault', label: 'Password Vault', icon: Key, color: 'text-blue-500' },
    { id: 'cards', label: 'Bank Cards', icon: CreditCard, color: 'text-green-500' },
    { id: 'documents', label: 'Documents', icon: FileText, color: 'text-orange-500' },
    { id: 'bank', label: 'Bank Details', icon: Building2, color: 'text-purple-500' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-500' },
  ];

  const fetchStats = async () => {
    try {
      // Replace with your actual API endpoints
      const [passwordsRes, cardsRes, documentsRes, banksRes] = await Promise.all([
        fetch('/api/passwords/count'),
        fetch('/api/cards/count'),
        fetch('/api/documents/count'),
        fetch('/api/banks/count')
      ]);

      const newStats = {
        passwords: await passwordsRes.json(),
        cards: await cardsRes.json(),
        documents: await documentsRes.json(),
        banks: await banksRes.json()
      };

      setStats(newStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data for demonstration
      setStats({
        passwords: 24,
        cards: 3,
        documents: 12,
        banks: 5
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'vault': return <VaultSection user={user} />;
      case 'cards': return <CardsSection user={user} />;
      case 'documents': return <DocumentsSection user={user} />;
      case 'bank': return <BankDetailsSection user={user} />;
      case 'settings': return <SettingsSection user={user} onLogout={onLogout} />;
      default: return <VaultSection user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-lg font-bold">SecureDesk</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start space-x-3 ${activeSection === item.id ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-primary' : item.color}`} />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Separator />
          <div className="flex items-center space-x-3 p-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold">
                  {menuItems.find(item => item.id === activeSection)?.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user.name.split(' ')[0]}! 
                  <span className="ml-2">🔒 Your data is secure</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="p-6">
          {activeSection === 'vault' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Key className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{isLoading ? <span className="animate-pulse">--</span> : stats.passwords}</p>
                        <p className="text-sm text-muted-foreground">Passwords</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{isLoading ? <span className="animate-pulse">--</span> : stats.cards}</p>
                        <p className="text-sm text-muted-foreground">Bank Cards</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{isLoading ? <span className="animate-pulse">--</span> : stats.documents}</p>
                        <p className="text-sm text-muted-foreground">Documents</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{isLoading ? <span className="animate-pulse">--</span> : stats.banks}</p>
                        <p className="text-sm text-muted-foreground">Bank Details</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


