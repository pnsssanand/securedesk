import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2,
  Share,
  CreditCard,
  User,
  Hash,
  Key
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { saveBankDetail, getAllBankDetails, updateBankDetail, deleteBankDetail } from '@/services/database';

interface BankDetail {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  customerId?: string;
  pin?: string;
  netBankingId?: string;
  netBankingPassword?: string;
  isPrimary: boolean;
  createdAt: Date;
}

interface BankDetailFormData {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  customerId?: string;
  pin?: string;
  netBankingId?: string;
  netBankingPassword?: string;
  isPrimary: boolean;
}

interface BankDetailsSectionProps {
  user: { id: string; name: string; email: string; };
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({ user }) => {
  const { showSuccess, showError } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState<string[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDetailId, setCurrentDetailId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BankDetailFormData>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    customerId: '',
    pin: '',
    netBankingId: '',
    netBankingPassword: '',
    isPrimary: false
  });

  // Load bank details on component mount
  useEffect(() => {
    const loadBankDetails = async () => {
      try {
        const details = await getAllBankDetails(user.id);
        // Transform to match our component's BankDetail interface
        const transformedDetails = details.map(detail => ({
          id: detail.id,
          bankName: detail.bankName,
          accountHolderName: detail.accountHolderName,
          accountNumber: detail.accountNumber,
          ifscCode: detail.ifscCode,
          customerId: detail.customerId,
          pin: detail.pin,
          netBankingId: detail.netBankingId,
          netBankingPassword: detail.netBankingPassword,
          isPrimary: detail.isPrimary,
          createdAt: new Date(detail.createdAt)
        }));
        
        setBankDetails(transformedDetails);
      } catch (error) {
        console.error('Failed to load bank details:', error);
        showError('Load Failed', 'Could not load your bank details');
      }
    };
    
    loadBankDetails();
  }, [user.id]);

  const handleFormChange = (field: keyof BankDetailFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDetailVisibility = (id: string) => {
    setVisibleDetails(prev => 
      prev.includes(id) 
        ? prev.filter(detailId => detailId !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Copied!', `${type} copied to clipboard`);
    } catch (err) {
      showError('Failed to Copy', 'Could not copy to clipboard');
    }
  };

  const shareAllDetails = (bankDetail: BankDetail) => {
    const details = `
Bank: ${bankDetail.bankName}
Account Holder: ${bankDetail.accountHolderName}
Account Number: ${bankDetail.accountNumber}
IFSC Code: ${bankDetail.ifscCode}
${bankDetail.customerId ? `Customer ID: ${bankDetail.customerId}` : ''}
${bankDetail.netBankingId ? `Net Banking ID: ${bankDetail.netBankingId}` : ''}
    `.trim();
    
    copyToClipboard(details, 'Bank details');
  };

  const maskAccountNumber = (accountNumber: string, visible: boolean = false) => {
    if (!visible) {
      return accountNumber.replace(/\d(?=\d{4})/g, '*');
    }
    return accountNumber;
  };

  const handleEditDetail = (detail: BankDetail) => {
    setFormData({
      bankName: detail.bankName,
      accountHolderName: detail.accountHolderName,
      accountNumber: detail.accountNumber,
      ifscCode: detail.ifscCode,
      customerId: detail.customerId || '',
      pin: detail.pin || '',
      netBankingId: detail.netBankingId || '',
      netBankingPassword: detail.netBankingPassword || '',
      isPrimary: detail.isPrimary
    });
    
    setCurrentDetailId(detail.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleDeleteDetail = async (id: string) => {
    try {
      await deleteBankDetail(id, user.id);
      setBankDetails(prev => prev.filter(detail => detail.id !== id));
      showSuccess('Deleted', 'Bank account removed successfully');
    } catch (error) {
      console.error('Failed to delete bank detail:', error);
      showError('Delete Failed', 'Could not delete the bank account');
    }
  };

  const handleSaveDetail = async () => {
    // Validate required fields
    if (!formData.bankName || !formData.accountHolderName || !formData.accountNumber || !formData.ifscCode) {
      showError('Missing Fields', 'Please fill in all required fields');
      return;
    }

    try {
      if (isEditing && currentDetailId) {
        // Update existing bank detail
        await updateBankDetail(currentDetailId, formData, user.id);
        
        // Update local state
        setBankDetails(prev => prev.map(detail => detail.id === currentDetailId ? {
          ...detail,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          customerId: formData.customerId || undefined,
          pin: formData.pin || undefined,
          netBankingId: formData.netBankingId || undefined,
          netBankingPassword: formData.netBankingPassword || undefined,
          isPrimary: formData.isPrimary
        } : detail));
        
        showSuccess('Updated!', 'Bank account updated successfully');
      } else {
        // Save new bank detail
        const result = await saveBankDetail(formData, user.id);
        
        // Add to local state
        setBankDetails(prev => [...prev, {
          id: result.id,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          customerId: formData.customerId || undefined,
          pin: formData.pin || undefined,
          netBankingId: formData.netBankingId || undefined,
          netBankingPassword: formData.netBankingPassword || undefined,
          isPrimary: formData.isPrimary,
          createdAt: new Date()
        }]);
        
        showSuccess('Saved!', 'New bank account saved securely');
      }

      setShowAddModal(false);
      setIsEditing(false);
      setCurrentDetailId(null);
      setFormData({
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        customerId: '',
        pin: '',
        netBankingId: '',
        netBankingPassword: '',
        isPrimary: false
      });
    } catch (error) {
      console.error('Failed to save bank detail:', error);
      showError('Save Failed', 'Could not save your bank account details');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bank Details</h2>
          <p className="text-muted-foreground">Manage your banking information securely</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setCurrentDetailId(null);
              setFormData({
                bankName: '',
                accountHolderName: '',
                accountNumber: '',
                ifscCode: '',
                customerId: '',
                pin: '',
                netBankingId: '',
                netBankingPassword: '',
                isPrimary: false
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update your bank account details' : 'Store your bank account details securely'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input 
                  id="bankName" 
                  placeholder="e.g., HDFC Bank" 
                  value={formData.bankName}
                  onChange={(e) => handleFormChange('bankName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                <Input 
                  id="accountHolderName" 
                  placeholder="Full name as per bank records" 
                  value={formData.accountHolderName}
                  onChange={(e) => handleFormChange('accountHolderName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input 
                  id="accountNumber" 
                  placeholder="Enter account number" 
                  value={formData.accountNumber}
                  onChange={(e) => handleFormChange('accountNumber', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code *</Label>
                <Input 
                  id="ifscCode" 
                  placeholder="e.g., HDFC0001234" 
                  value={formData.ifscCode}
                  onChange={(e) => handleFormChange('ifscCode', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID (Optional)</Label>
                <Input 
                  id="customerId" 
                  placeholder="Enter customer ID" 
                  value={formData.customerId}
                  onChange={(e) => handleFormChange('customerId', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin">ATM PIN (Optional)</Label>
                <Input 
                  id="pin" 
                  type="password" 
                  placeholder="Enter PIN" 
                  maxLength={6}
                  value={formData.pin}
                  onChange={(e) => handleFormChange('pin', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netBankingId">Net Banking ID (Optional)</Label>
                <Input 
                  id="netBankingId" 
                  placeholder="Enter net banking user ID" 
                  value={formData.netBankingId}
                  onChange={(e) => handleFormChange('netBankingId', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netBankingPassword">Net Banking Password (Optional)</Label>
                <Input 
                  id="netBankingPassword" 
                  type="password" 
                  placeholder="Enter net banking password" 
                  value={formData.netBankingPassword}
                  onChange={(e) => handleFormChange('netBankingPassword', e.target.value)}
                />
              </div>
              
              <Button className="w-full" onClick={handleSaveDetail}>
                {isEditing ? 'Update Bank Account' : 'Save Bank Account'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bank Details Grid */}
      <div className="grid gap-6">
        {bankDetails.map((bankDetail) => {
          const isVisible = visibleDetails.includes(bankDetail.id);
          
          return (
            <Card key={bankDetail.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{bankDetail.bankName}</h3>
                      <p className="text-sm text-muted-foreground">{bankDetail.accountHolderName}</p>
                      {bankDetail.isPrimary && (
                        <Badge className="mt-1">Primary Account</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareAllDetails(bankDetail)}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleDetailVisibility(bankDetail.id)}
                    >
                      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditDetail(bankDetail)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteDetail(bankDetail.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Account Number</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">
                          {maskAccountNumber(bankDetail.accountNumber, isVisible)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(bankDetail.accountNumber, 'Account number')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">IFSC Code</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{bankDetail.ifscCode}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(bankDetail.ifscCode, 'IFSC code')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {bankDetail.customerId && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Customer ID</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {isVisible ? bankDetail.customerId : '••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(bankDetail.customerId!, 'Customer ID')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {bankDetail.pin && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">ATM PIN</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {isVisible ? bankDetail.pin : '••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(bankDetail.pin!, 'PIN')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {bankDetail.netBankingId && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Net Banking ID</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {isVisible ? bankDetail.netBankingId : '••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(bankDetail.netBankingId!, 'Net Banking ID')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {bankDetail.netBankingPassword && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Net Banking Password</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {isVisible ? bankDetail.netBankingPassword : '••••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(bankDetail.netBankingPassword!, 'Net Banking Password')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Added on {bankDetail.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {bankDetails.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bank accounts found</h3>
            <p className="text-muted-foreground mb-4">
              Add your first bank account to get started
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Bank Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankDetailsSection;
