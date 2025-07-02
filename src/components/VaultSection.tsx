import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, EyeOff, Copy, Edit, Trash2, Globe, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { savePassword, getAllPasswords, updatePassword, deletePassword } from '@/services/database';

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

interface VaultSectionProps {
  user: { id: string; name: string; email: string; };
}

const VaultSection: React.FC<VaultSectionProps> = ({ user }) => {
  const { showSuccess, showError, showSecurity } = useToast();
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
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

  // Fetch passwords on component mount
  useEffect(() => {
    const loadPasswords = async () => {
      try {
        const dbPasswords = await getAllPasswords(user.id);
        // Transform the database passwords to match our component's PasswordEntry interface
        const transformedPasswords = dbPasswords.map(pwd => ({
          id: pwd.id,
          title: pwd.title,
          url: pwd.url || '',
          username: pwd.username,
          password: pwd.password,
          notes: pwd.notes || '',
          strength: pwd.strength as 'weak' | 'medium' | 'strong',
          lastModified: new Date(pwd.updatedAt)
        }));
        setPasswords(transformedPasswords);
      } catch (error) {
        console.error('Failed to load passwords:', error);
        showError('Load Failed', 'Could not load your passwords');
      }
    };
    
    loadPasswords();
  }, [user.id]);

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
      showSuccess('Copied Successfully!', `${type} has been copied to your clipboard`);
    } catch (err) {
      showError('Copy Failed', 'Unable to copy to clipboard. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.username || !formData.password) {
      showError('Missing Required Fields', 'Please fill in title, username, and password to continue');
      return;
    }

    try {
      if (editingPassword) {
        // Update existing password
        await updatePassword(
          editingPassword.id,
          formData.title,
          formData.username,
          formData.password,
          formData.url,
          formData.notes,
          null, // folderId
          user.id // Add user.id
        );
        
        // Update local state
        setPasswords(prev => prev.map(p => p.id === editingPassword.id ? {
          ...p,
          title: formData.title,
          username: formData.username,
          password: formData.password,
          url: formData.url,
          notes: formData.notes,
          strength: checkPasswordStrength(formData.password),
          lastModified: new Date()
        } : p));
        
        showSuccess('Password Updated!', 'Your password has been successfully updated and secured');
      } else {
        // Save new password
        const result = await savePassword(
          formData.title,
          formData.username,
          formData.password,
          formData.url,
          formData.notes,
          null, // folderId
          user.id // Add user.id
        );
        
        // Add to local state
        setPasswords(prev => [...prev, {
          id: result.id,
          title: formData.title,
          username: formData.username,
          password: formData.password,
          url: formData.url,
          notes: formData.notes,
          strength: checkPasswordStrength(formData.password),
          lastModified: new Date()
        }]);
        
        showSuccess('Password Saved!', 'Your new password has been securely added to your vault');
      }

      setIsDialogOpen(false);
      setEditingPassword(null);
      setFormData({ title: '', url: '', username: '', password: '', notes: '' });
    } catch (error) {
      console.error('Failed to save password:', error);
      showError('Save Failed', 'Unable to save your password. Please check your connection and try again.');
    }
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

  const handleDelete = async (id: string) => {
    try {
      await deletePassword(id, user.id);
      setPasswords(prev => prev.filter(p => p.id !== id));
      showSecurity('Password Deleted', 'The password entry has been permanently removed from your vault');
    } catch (error) {
      console.error('Failed to delete password:', error);
      showError('Delete Failed', 'Unable to delete the password. Please try again.');
    }
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
