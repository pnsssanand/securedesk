import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LogOut,
  Calendar,
  Phone,
  Building,
  MapPin,
  PenLine,
  Check,
  Image,
  UserCircle
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SettingsSectionProps {
  user: { id: string; name: string; email: string; };
  onLogout: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ user, onLogout }) => {
  // Use the Toast context instead of AlertProvider
  const { showSuccess, showError, showInfo } = useToast();
  
  // File input ref for avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // User profile state
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    bio: "",
    avatarUrl: "", // Default avatar
    profileVisibility: "private" as "private" | "contacts" | "public"
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    autoSync: true,
    biometricAuth: false,
    twoFactorAuth: false,
    emailNotifications: true,
    securityAlerts: true,
    autoLogout: true,
    logoutTime: 15,
    darkMode: true,
    compactView: false,
    language: "english"
  });
  
  // Avatar preview state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Active settings tab
  const [activeTab, setActiveTab] = useState("profile");

  // Handle settings change
  const handleSettingChange = (key: string, value: boolean | number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle profile data change
  const handleProfileChange = (key: string, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  // Handle avatar upload
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showError("File Too Large", "Avatar image must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleUpdateProfile = () => {
    // Here you would typically handle the API call to update the profile
    // For demonstration, we'll just show a success message
    showSuccess('Profile Updated', 'Your profile information has been updated successfully');
  };
  
  // Generate avatar fallback from name
  const getNameInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <PenLine className="w-4 h-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2 text-red-500">
            <Trash2 className="w-4 h-4" /> Account
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-2 border-primary/20">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={profileData.name} />
                    ) : profileData.avatarUrl ? (
                      <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
                    ) : (
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {getNameInitials(profileData.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <button 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                    onClick={handleAvatarUpload}
                  >
                    <Image className="w-6 h-6 text-white" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleAvatarUpload}>
                      <Upload className="w-4 h-4 mr-2" /> Upload Avatar
                    </Button>
                    {avatarPreview && (
                      <Button variant="outline" size="sm" onClick={() => setAvatarPreview(null)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-semibold mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                      id="dob" 
                      type="date" 
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Address Information */}
              <div>
                <h4 className="text-sm font-semibold mb-4">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      value={profileData.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={profileData.city}
                      onChange={(e) => handleProfileChange('city', e.target.value)}
                      placeholder="Your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode" 
                      value={profileData.postalCode}
                      onChange={(e) => handleProfileChange('postalCode', e.target.value)}
                      placeholder="Postal code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={profileData.country}
                      onChange={(e) => handleProfileChange('country', e.target.value)}
                      placeholder="Your country"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Profile Visibility */}
              <div>
                <h4 className="text-sm font-semibold mb-4">Profile Visibility</h4>
                <RadioGroup 
                  value={profileData.profileVisibility} 
                  onValueChange={(value) => handleProfileChange('profileVisibility', value as "private" | "contacts" | "public")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="font-normal">Private - Only you can see your profile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contacts" id="contacts" />
                    <Label htmlFor="contacts" className="font-normal">Contacts - Only your contacts can see your profile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="font-normal">Public - Anyone can see your profile</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              {/* Bio/About */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">Brief description for your profile.</p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={handleUpdateProfile}>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Password & Authentication</span>
              </CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Change Master Password</Label>
                  <p className="text-sm text-muted-foreground">Update your master password</p>
                </div>
                <Button variant="outline" onClick={() => showInfo('Feature Coming Soon', 'Password change functionality will be available soon.')}>
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Control your login sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <div className="pt-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Lock className="w-4 h-4 mr-2" />
                  Log Out All Other Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize your visual experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">Show more content with less spacing</p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) => handleSettingChange('compactView', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Data & Sync</CardTitle>
              <CardDescription>Manage your data sync preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" /> Import Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Management Tab */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border border-red-200 dark:border-red-900 rounded-lg p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data. This action is irreversible.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete My Account</Button>
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
              
              <div className="border border-orange-200 dark:border-orange-900 rounded-lg p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-orange-600 dark:text-orange-400">Sign Out</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50 dark:border-orange-900 dark:hover:bg-orange-950" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;
