
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Plus, 
  Upload, 
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2,
  Calendar,
  Shield
} from 'lucide-react';

interface BankCard {
  id: string;
  type: 'credit' | 'debit';
  bankName: string;
  cardName: string;
  variant: 'visa' | 'mastercard' | 'rupay';
  cardNumber: string;
  cvv: string;
  validFrom: string;
  validTo: string;
  cardImage?: string;
  color: string;
}

const CardsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('credit');
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState<string[]>([]);

  // Sample data
  const [cards, setCards] = useState<BankCard[]>([
    {
      id: '1',
      type: 'credit',
      bankName: 'HDFC Bank',
      cardName: 'Regalia Credit Card',
      variant: 'visa',
      cardNumber: '4532 1234 5678 9012',
      cvv: '123',
      validFrom: '01/22',
      validTo: '01/27',
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: '2',
      type: 'debit',
      bankName: 'SBI',
      cardName: 'Classic Debit Card',
      variant: 'mastercard',
      cardNumber: '5432 1098 7654 3210',
      cvv: '456',
      validFrom: '03/21',
      validTo: '03/26',
      color: 'from-green-600 to-teal-600'
    },
    {
      id: '3',
      type: 'credit',
      bankName: 'ICICI Bank',
      cardName: 'Sapphiro Credit Card',
      variant: 'visa',
      cardNumber: '4111 1111 1111 1111',
      cvv: '789',
      validFrom: '06/23',
      validTo: '06/28',
      color: 'from-orange-600 to-red-600'
    }
  ]);

  const toggleCardDetails = (id: string) => {
    setVisibleDetails(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    console.log(`${type} copied to clipboard`);
  };

  const getVariantLogo = (variant: string) => {
    const logos = {
      visa: 'VISA',
      mastercard: 'MasterCard',
      rupay: 'RuPay'
    };
    return logos[variant as keyof typeof logos] || variant.toUpperCase();
  };

  const formatCardNumber = (number: string, visible: boolean = false) => {
    if (!visible) {
      return number.replace(/\d(?=\d{4})/g, '*');
    }
    return number;
  };

  const filteredCards = cards.filter(card => card.type === activeTab);

  const CardComponent = ({ card }: { card: BankCard }) => {
    const isVisible = visibleDetails.includes(card.id);
    
    return (
      <div className="space-y-4">
        {/* Card Visual */}
        <div className={`relative w-full h-48 rounded-xl bg-gradient-to-br ${card.color} p-6 text-white shadow-lg`}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm opacity-80">{card.bankName}</p>
              <p className="text-lg font-semibold">{card.cardName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">{getVariantLogo(card.variant)}</p>
              <Badge variant="secondary" className="mt-1">
                {card.type.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-mono tracking-wider">
              {formatCardNumber(card.cardNumber, isVisible)}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80">VALID FROM</p>
                <p className="text-sm font-mono">{card.validFrom}</p>
              </div>
              <div>
                <p className="text-xs opacity-80">VALID THRU</p>
                <p className="text-sm font-mono">{card.validTo}</p>
              </div>
              <div>
                <p className="text-xs opacity-80">CVV</p>
                <p className="text-sm font-mono">{isVisible ? card.cvv : '***'}</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4">
            <CreditCard className="w-8 h-8 opacity-20" />
          </div>
        </div>

        {/* Card Details */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{card.cardName}</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCardDetails(card.id)}
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
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Number:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{formatCardNumber(card.cardNumber, isVisible)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(card.cardNumber.replace(/\s/g, ''), 'Card number')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CVV:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{isVisible ? card.cvv : '***'}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(card.cvv, 'CVV')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid From:</span>
                  <span className="font-mono">{card.validFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid To:</span>
                  <span className="font-mono">{card.validTo}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bank Cards</h2>
          <p className="text-muted-foreground">Manage your credit and debit cards securely</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Card</DialogTitle>
              <DialogDescription>
                Store your bank card details securely
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardType">Card Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="e.g., HDFC Bank" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Card Name</Label>
                <Input id="cardName" placeholder="e.g., Regalia Credit Card" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="variant">Card Variant</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">MasterCard</SelectItem>
                    <SelectItem value="rupay">RuPay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" maxLength={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input id="validFrom" placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input id="validTo" placeholder="MM/YY" maxLength={5} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Card Image (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload card image</p>
                </div>
              </div>
              
              <Button className="w-full">Save Card</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
          <TabsTrigger value="debit">Debit Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {filteredCards.length > 0 ? (
            <div className="grid gap-6">
              {filteredCards.map((card) => (
                <CardComponent key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No {activeTab} cards found</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first {activeTab} card to get started
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {activeTab === 'credit' ? 'Credit' : 'Debit'} Card
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardsSection;
