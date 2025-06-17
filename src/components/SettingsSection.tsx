
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Shield, 
  Key, 
  Download, 
  Upload, 
  Trash2, 
  User, 
  Mail,
  Bell,
  Smartphone,
  Lock,
  LogOut
} from 'lucide-react';

interface SettingsSectionProps {
  user: { name: string; email: string; };
  onLogout: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ user, onLogout }) => {
  const [settings, setSettings] = useState({
    autoSync: true,
    biometricAuth: false,
    twoFactorAuth: false,
    emailNotifications: true,
    securityAlerts: true,
    autoLogout: true,
    logoutTime: 15
  });

  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Settings</span>
          </CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
          </div>
          
          <Button>Update Profile</Button>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>Manage your security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Password & Authentication</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Change Master Password</Label>
                  <p className="text-sm text-muted-foreground">Update your master password</p>
                </div>
                <Button variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Biometric Authentication</Label>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                </div>
                <Switch
                  checked={settings.biometricAuth}
                  onCheckedChange={(checked) => handleSettingChange('biometricAuth', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Session Management</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Logout</Label>
                <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
              </div>
              <Switch
                checked={settings.autoLogout}
                onCheckedChange={(checked) => handleSettingChange('autoLogout', checked)}
              />
            </div>
            
            {settings.autoLogout && (
              <div className="space-y-2">
                <Label htmlFor="logoutTime">Auto logout time (minutes)</Label>
                <Input
                  id="logoutTime"
                  type="number"
                  min="5"
                  max="60"
                  value={settings.logoutTime}
                  onChange={(e) => handleSettingChange('logoutTime', parseInt(e.target.value))}
                  className="max-w-32"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data & Sync Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>Backup, sync, and manage your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto Sync</Label>
              <p className="text-sm text-muted-foreground">Automatically sync data across devices</p>
            </div>
            <Switch
              checked={settings.autoSync}
              onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Backup & Export</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Vault</span>
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive important updates via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about security events</p>
            </div>
            <Switch
              checked={settings.securityAlerts}
              onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <Trash2 className="w-5 h-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
            <div className="space-y-1">
              <Label className="text-red-600 dark:text-red-400">Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers, including passwords, documents,
                    and bank details.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-orange-200 dark:border-orange-900 rounded-lg">
            <div className="space-y-1">
              <Label className="text-orange-600 dark:text-orange-400">Sign Out</Label>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
