import React, { useState } from 'react';
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

interface BankDetailsSectionProps {
  user: { id: string; name: string; email: string; };
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({ user }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState<string[]>([]);

  // Sample data
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([
    {
      id: '1',
      bankName: 'HDFC Bank',
      accountHolderName: 'John Doe',
      accountNumber: '12345678901234',
      ifscCode: 'HDFC0001234',
      customerId: 'CUST123456',
      pin: '1234',
      netBankingId: 'john.doe',
      netBankingPassword: 'SecurePass123',
      isPrimary: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      bankName: 'State Bank of India',
      accountHolderName: 'John Doe',
      accountNumber: '98765432109876',
      ifscCode: 'SBIN0001234',
      customerId: 'SBI123456',
      isPrimary: false,
      createdAt: new Date('2024-01-10')
    }
  ]);

  const toggleDetailVisibility = (id: string) => {
    setVisibleDetails(prev => 
      prev.includes(id) 
        ? prev.filter(detailId => detailId !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    console.log(`${type} copied to clipboard`);
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
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
              <DialogDescription>
                Store your bank account details securely
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="e.g., HDFC Bank" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input id="accountHolderName" placeholder="Full name as per bank records" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="Enter account number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input id="ifscCode" placeholder="e.g., HDFC0001234" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID (Optional)</Label>
                <Input id="customerId" placeholder="Enter customer ID" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin">ATM PIN (Optional)</Label>
                <Input id="pin" type="password" placeholder="Enter PIN" maxLength={6} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netBankingId">Net Banking ID (Optional)</Label>
                <Input id="netBankingId" placeholder="Enter net banking user ID" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netBankingPassword">Net Banking Password (Optional)</Label>
                <Input id="netBankingPassword" type="password" placeholder="Enter net banking password" />
              </div>
              
              <Button className="w-full">Save Bank Details</Button>
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
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
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
