
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, EyeOff, Copy, Edit, Trash2, Globe, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface PasswordEntry {
  id: string;
  title: string;
  url: string;
  username: string;
  password: string;
  notes: string;
  strength: 'weak' | 'medium' | 'strong';
  lastModified: Date;
}

const VaultSection = () => {
  const { showSuccess, showError, showSecurity } = useToast();
  const [passwords, setPasswords] = useState<PasswordEntry[]>([
    {
      id: '1',
      title: 'Google Account',
      url: 'https://accounts.google.com',
      username: 'john.doe@gmail.com',
      password: 'MyStr0ngP@ssw0rd123',
      notes: 'Main Google account',
      strength: 'strong',
      lastModified: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Facebook',
      url: 'https://facebook.com',
      username: 'john.doe@gmail.com',
      password: 'facebook123',
      notes: 'Social media account',
      strength: 'weak',
      lastModified: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Banking App',
      url: 'https://mybank.com',
      username: 'johndoe123',
      password: 'Bank@2024#Secure',
      notes: 'Primary banking account',
      strength: 'strong',
      lastModified: new Date('2024-01-20')
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    username: '',
    password: '',
    notes: ''
  });

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({ ...prev, password }));
    showSuccess('Password Generated', 'Strong password generated successfully!');
  };

  const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Copied!', `${type} copied to clipboard`);
    } catch (err) {
      showError('Failed to Copy', 'Could not copy to clipboard');
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.username || !formData.password) {
      showError('Missing Fields', 'Please fill in all required fields');
      return;
    }

    const passwordEntry: PasswordEntry = {
      id: editingPassword?.id || Date.now().toString(),
      title: formData.title,
      url: formData.url,
      username: formData.username,
      password: formData.password,
      notes: formData.notes,
      strength: checkPasswordStrength(formData.password),
      lastModified: new Date()
    };

    if (editingPassword) {
      setPasswords(prev => prev.map(p => p.id === editingPassword.id ? passwordEntry : p));
      showSuccess('Updated!', 'Password entry updated successfully');
    } else {
      setPasswords(prev => [...prev, passwordEntry]);
      showSuccess('Saved!', 'New password entry saved securely');
    }

    setIsDialogOpen(false);
    setEditingPassword(null);
    setFormData({ title: '', url: '', username: '', password: '', notes: '' });
  };

  const handleEdit = (password: PasswordEntry) => {
    setEditingPassword(password);
    setFormData({
      title: password.title,
      url: password.url,
      username: password.username,
      password: password.password,
      notes: password.notes
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
    showSecurity('Deleted', 'Password entry removed from vault');
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPasswords = passwords.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const weakPasswords = passwords.filter(p => p.strength === 'weak').length;

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingPassword(null);
                setFormData({ title: '', url: '', username: '', password: '', notes: '' });
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPassword ? 'Edit Password' : 'Add New Password'}</DialogTitle>
              <DialogDescription>
                {editingPassword ? 'Update your password entry' : 'Save a new password to your vault'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Google Account"
                />
              </div>
              <div>
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="username">Username/Email *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                  />
                  <Button type="button" variant="outline" onClick={generatePassword}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingPassword ? 'Update Password' : 'Save Password'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Alert */}
      {weakPasswords > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-300">
                  Security Alert: {weakPasswords} weak password{weakPasswords > 1 ? 's' : ''} detected
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Consider updating weak passwords for better security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password entries */}
      <div className="grid gap-4">
        {filteredPasswords.map((password) => (
          <Card key={password.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    {password.url && <Globe className="w-4 h-4 text-muted-foreground" />}
                    <h3 className="font-semibold">{password.title}</h3>
                    <Badge variant={password.strength === 'strong' ? 'default' : password.strength === 'medium' ? 'secondary' : 'destructive'}>
                      {password.strength}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Username: {password.username}</p>
                    <div className="flex items-center space-x-2">
                      <span>Password:</span>
                      <span className="font-mono">
                        {showPasswords[password.id] ? password.password : '••••••••'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(password.id)}
                      >
                        {showPasswords[password.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(password.password, 'Password')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    {password.url && (
                      <p>URL: <a href={password.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{password.url}</a></p>
                    )}
                    {password.notes && <p>Notes: {password.notes}</p>}
                    <p className="text-xs">Last modified: {password.lastModified.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(password)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(password.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPasswords.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No passwords found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No passwords match your search.' : 'Start by adding your first password to the vault.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Password
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VaultSection;
