import React, { useState, useEffect } from 'react';
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
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { saveCard, getAllCards, updateCard, deleteCard } from '@/services/database';
import { useToast } from '@/contexts/ToastContext';

interface BankCard {
  id: string;
  type: 'credit' | 'debit';
  bankName: string;
  cardName: string;
  cardHolderName: string; // Added card holder name
  variant: 'visa' | 'mastercard' | 'rupay';
  cardNumber: string;
  cvv: string;
  validFrom: string;
  validTo: string;
  cardImage?: string;
  color: string;
}

interface CardsSectionProps {
  user: { id: string; name: string; email: string; };
}

interface CardFormData {
  type: 'credit' | 'debit';
  bankName: string;
  cardName: string;
  cardHolderName: string; // Added card holder name
  variant: 'visa' | 'mastercard' | 'rupay';
  cardNumber: string;
  cvv: string;
  validFrom: string;
  validTo: string;
  color: string;
}

const CardsSection: React.FC<CardsSectionProps> = ({ user }) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [activeTab, setActiveTab] = useState('credit');
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CardFormData>({
    type: 'credit',
    bankName: '',
    cardName: '',
    cardHolderName: '',
    variant: 'visa',
    cardNumber: '',
    cvv: '',
    validFrom: '',
    validTo: '',
    color: 'from-blue-600 to-purple-600'
  });

  // Initialize with empty array instead of demo data
  const [cards, setCards] = useState<BankCard[]>([]);

  // Fetch cards from database when component loads
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const userCards = await getAllCards(user.id);
        setCards(userCards || []);
      } catch (error) {
        console.error('Error fetching cards:', error);
        showError('Failed to Load', 'Could not load your cards. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [user.id, showError]);

  // Added missing handleDeleteCard function
  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id, user.id);
      setCards(prev => prev.filter(card => card.id !== id));
      showSuccess('Card Deleted', 'Your bank card has been successfully removed from the vault');
    } catch (error) {
      console.error('Failed to delete card:', error);
      showError('Delete Failed', 'Could not delete the card. Please try again.');
    }
  };

  // Added missing handleAddCardClick function
  const handleAddCardClick = () => {
    // Set default type to match the current active tab
    setFormData(prev => ({ ...prev, type: activeTab as 'credit' | 'debit' }));
    setIsEditing(false);
    setCurrentCardId(null);
    setShowAddModal(true);
  };

  const toggleCardDetails = (id: string) => {
    setVisibleDetails(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Copied!', `${type} copied to clipboard`);
    } catch (error) {
      console.error(`Failed to copy ${type}:`, error);
      showError('Copy Failed', 'Could not copy to clipboard');
    }
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

  // Handle form field changes with validation
  const handleFormChange = (field: keyof CardFormData, value: string) => {
    // Clear the error for this field when user makes changes
    setFormErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'type' && (value === 'credit' || value === 'debit')) {
      setFormData(prev => ({ ...prev, type: value }));
    } else if (field === 'variant' && (value === 'visa' || value === 'mastercard' || value === 'rupay')) {
      setFormData(prev => ({ ...prev, variant: value as 'visa' | 'mastercard' | 'rupay' }));
    } else if (field === 'cardNumber') {
      // Format card number with spaces for better readability
      const formatted = value.replace(/[^0-9]/g, '').substring(0, 16);
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
    } else if (field === 'cvv') {
      // Only allow numbers for CVV
      const formatted = value.replace(/[^0-9]/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, cvv: formatted }));
    } else if (field === 'validFrom' || field === 'validTo') {
      // Format MM/YY dates
      let formatted = value.replace(/[^0-9]/g, '');
      if (formatted.length > 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
      }
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.bankName.trim()) {
      errors.bankName = 'Bank name is required';
    }
    
    if (!formData.cardName.trim()) {
      errors.cardName = 'Card name is required';
    }
    
    if (!formData.cardHolderName.trim()) {
      errors.cardHolderName = 'Card holder name is required';
    }
    
    if (!formData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Card number must be at least 13 digits';
    }
    
    if (!formData.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      errors.cvv = 'CVV must be at least 3 digits';
    }
    
    if (!formData.validFrom.trim()) {
      errors.validFrom = 'Valid from date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.validFrom)) {
      errors.validFrom = 'Format must be MM/YY';
    }
    
    if (!formData.validTo.trim()) {
      errors.validTo = 'Valid to date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.validTo)) {
      errors.validTo = 'Format must be MM/YY';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save or update card
  const handleSaveCard = async () => {
    // Validate form before submission
    if (!validateForm()) {
      showError('Validation Error', 'Please correct the errors in the form');
      return;
    }
    
    try {
      // Set saving state to show loading indicator
      setIsSaving(true);
      
      const { type, bankName, cardName, cardHolderName, variant, cardNumber, cvv, validFrom, validTo, color } = formData;
      
      // Format data for saving
      const cardData = {
        type,
        bankName: bankName.trim(),
        cardName: cardName.trim(),
        cardHolderName: cardHolderName.trim(),
        variant,
        cardNumber: cardNumber.trim(),
        cvv: cvv.trim(),
        validFrom: validFrom.trim(),
        validTo: validTo.trim(),
        color
      };
      
      if (isEditing && currentCardId) {
        // Update existing card
        console.log('Updating card with ID:', currentCardId);
        console.log('Card data:', cardData);
        
        const updatedCard = await updateCard(currentCardId, cardData, user.id);
        
        // Update local state with the updated card
        setCards(prev => prev.map(card => 
          card.id === currentCardId ? { ...card, ...cardData } : card
        ));
        
        showSuccess('Card Updated', 'Your card details have been successfully updated');
      } else {
        // Add new card
        console.log('Adding new card:', cardData);
        const savedCard = await saveCard(cardData, user.id);
        
        if (!savedCard || !savedCard.id) {
          throw new Error('Failed to save card - no card data returned');
        }
        
        // Add to local state
        setCards(prev => [...prev, savedCard]);
        showSuccess('Card Added', 'Your bank card has been securely saved');
      }
      
      // Reset form and close modal
      setShowAddModal(false);
      setIsEditing(false);
      setCurrentCardId(null);
      setFormData({
        type: 'credit',
        bankName: '',
        cardName: '',
        cardHolderName: '',
        variant: 'visa',
        cardNumber: '',
        cvv: '',
        validFrom: '',
        validTo: '',
        color: 'from-blue-600 to-purple-600'
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error saving card:', error);
      showError('Save Failed', `Unable to save your card details: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Edit card function - needs to properly set the card data
  const handleEditCard = (card: BankCard) => {
    console.log("Editing card with ID:", card.id);
    
    // Make sure we're using the exact data from the card object
    setFormData({
      type: card.type,
      bankName: card.bankName,
      cardName: card.cardName,
      cardHolderName: card.cardHolderName,
      variant: card.variant,
      cardNumber: card.cardNumber,
      cvv: card.cvv,
      validFrom: card.validFrom,
      validTo: card.validTo,
      color: card.color
    });
    
    // Set the current card ID for update
    setCurrentCardId(card.id);
    setIsEditing(true);
    setShowAddModal(true);
    setFormErrors({}); // Clear any previous form errors
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
                <p className="text-xs opacity-80">CARDHOLDER</p>
                <p className="text-sm font-mono">{card.cardHolderName}</p>
              </div>
              <div className="flex space-x-4">
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditCard(card)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Holder:</span>
                  <span className="font-medium">{card.cardHolderName}</span>
                </div>
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

  // Show loading state while fetching cards
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading cards...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bank Cards</h2>
          <p className="text-muted-foreground">Manage your payment cards securely</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) {
            // Reset form errors when closing the dialog
            setFormErrors({});
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCardClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Card' : 'Add New Card'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update your card details' : 'Store your bank card details securely'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardType">Card Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={value => handleFormChange('type', value)}
                >
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
                <Label htmlFor="bankName" className={formErrors.bankName ? "text-red-500" : ""}>
                  Bank Name *
                </Label>
                <Input 
                  id="bankName" 
                  placeholder="e.g., HDFC Bank" 
                  value={formData.bankName}
                  onChange={e => handleFormChange('bankName', e.target.value)}
                  className={formErrors.bankName ? "border-red-500" : ""}
                />
                {formErrors.bankName && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.bankName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName" className={formErrors.cardName ? "text-red-500" : ""}>
                  Card Name *
                </Label>
                <Input 
                  id="cardName" 
                  placeholder="e.g., Regalia Credit Card" 
                  value={formData.cardName}
                  onChange={e => handleFormChange('cardName', e.target.value)}
                  className={formErrors.cardName ? "border-red-500" : ""}
                />
                {formErrors.cardName && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.cardName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardHolderName" className={formErrors.cardHolderName ? "text-red-500" : ""}>
                  Card Holder Name *
                </Label>
                <Input 
                  id="cardHolderName" 
                  placeholder="e.g., John Doe" 
                  value={formData.cardHolderName}
                  onChange={e => handleFormChange('cardHolderName', e.target.value)}
                  className={formErrors.cardHolderName ? "border-red-500" : ""}
                />
                {formErrors.cardHolderName && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.cardHolderName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="variant">Card Variant</Label>
                <Select 
                  value={formData.variant} 
                  onValueChange={value => handleFormChange('variant', value)}
                >
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
                <Label htmlFor="cardNumber" className={formErrors.cardNumber ? "text-red-500" : ""}>
                  Card Number *
                </Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  maxLength={19}
                  value={formData.cardNumber}
                  onChange={e => handleFormChange('cardNumber', e.target.value)}
                  className={formErrors.cardNumber ? "border-red-500" : ""}
                />
                {formErrors.cardNumber && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.cardNumber}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="cvv" className={formErrors.cvv ? "text-red-500" : ""}>
                    CVV *
                  </Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    maxLength={4} 
                    value={formData.cvv}
                    onChange={e => handleFormChange('cvv', e.target.value)}
                    className={formErrors.cvv ? "border-red-500" : ""}
                  />
                  {formErrors.cvv && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.cvv}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validFrom" className={formErrors.validFrom ? "text-red-500" : ""}>
                    Valid From *
                  </Label>
                  <Input 
                    id="validFrom" 
                    placeholder="MM/YY" 
                    maxLength={5} 
                    value={formData.validFrom}
                    onChange={e => handleFormChange('validFrom', e.target.value)}
                    className={formErrors.validFrom ? "border-red-500" : ""}
                  />
                  {formErrors.validFrom && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.validFrom}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo" className={formErrors.validTo ? "text-red-500" : ""}>
                    Valid To *
                  </Label>
                  <Input 
                    id="validTo" 
                    placeholder="MM/YY" 
                    maxLength={5} 
                    value={formData.validTo}
                    onChange={e => handleFormChange('validTo', e.target.value)}
                    className={formErrors.validTo ? "border-red-500" : ""}
                  />
                  {formErrors.validTo && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.validTo}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Card Color</Label>
                <Select 
                  value={formData.color} 
                  onValueChange={value => handleFormChange('color', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select card color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from-blue-600 to-purple-600">Blue-Purple</SelectItem>
                    <SelectItem value="from-green-600 to-teal-600">Green-Teal</SelectItem>
                    <SelectItem value="from-orange-600 to-red-600">Orange-Red</SelectItem>
                    <SelectItem value="from-gray-700 to-gray-800">Dark Gray</SelectItem>
                    <SelectItem value="from-pink-600 to-purple-600">Pink-Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSaveCard} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </span>
                ) : (
                  isEditing ? 'Update Card' : 'Save Card'
                )}
              </Button>
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
