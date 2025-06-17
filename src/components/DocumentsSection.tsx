
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Upload, 
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2,
  Download,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Car,
  User,
  Globe
} from 'lucide-react';

interface Document {
  id: string;
  type: 'aadhaar' | 'pan' | 'driving_license' | 'passport';
  name: string;
  documentNumber: string;
  frontImage?: string;
  backImage?: string;
  expiryDate?: string;
  isPrimary: boolean;
  createdAt: Date;
}

const DocumentsSection: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [visibleNumbers, setVisibleNumbers] = useState<string[]>([]);

  // Sample data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'aadhaar',
      name: 'John Doe',
      documentNumber: '1234 5678 9012',
      frontImage: '/placeholder-image.jpg',
      backImage: '/placeholder-image.jpg',
      isPrimary: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'pan',
      name: 'John Doe',
      documentNumber: 'ABCDE1234F',
      frontImage: '/placeholder-image.jpg',
      isPrimary: true,
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      type: 'driving_license',
      name: 'John Doe',
      documentNumber: 'DL1420110012345',
      frontImage: '/placeholder-image.jpg',
      backImage: '/placeholder-image.jpg',
      expiryDate: '2030-12-31',
      isPrimary: false,
      createdAt: new Date('2024-01-12')
    }
  ]);

  const documentTypes = [
    { value: 'all', label: 'All Documents' },
    { value: 'aadhaar', label: 'Aadhaar Card', icon: User },
    { value: 'pan', label: 'PAN Card', icon: CreditCard },
    { value: 'driving_license', label: 'Driving License', icon: Car },
    { value: 'passport', label: 'Passport', icon: Globe }
  ];

  const getDocumentIcon = (type: string) => {
    const icons = {
      aadhaar: User,
      pan: CreditCard,
      driving_license: Car,
      passport: Globe
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getDocumentColor = (type: string) => {
    const colors = {
      aadhaar: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
      pan: 'text-green-500 bg-green-50 dark:bg-green-950',
      driving_license: 'text-orange-500 bg-orange-50 dark:bg-orange-950',
      passport: 'text-purple-500 bg-purple-50 dark:bg-purple-950'
    };
    return colors[type as keyof typeof colors] || 'text-gray-500 bg-gray-50 dark:bg-gray-950';
  };

  const toggleNumberVisibility = (id: string) => {
    setVisibleNumbers(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    console.log(`${type} copied to clipboard`);
  };

  const maskDocumentNumber = (number: string, type: string) => {
    if (type === 'aadhaar') {
      return number.replace(/\d(?=\d{4})/g, '*');
    } else if (type === 'pan') {
      return number.substring(0, 2) + '***' + number.substring(5);
    }
    return number.replace(/./g, '*').substring(0, number.length - 4) + number.substring(number.length - 4);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-muted-foreground">Securely store your important documents</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Store your important documents securely
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.slice(1).map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="docName">Name on Document</Label>
                <Input id="docName" placeholder="Enter name as on document" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="docNumber">Document Number</Label>
                <Input id="docNumber" placeholder="Enter document number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input id="expiryDate" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label>Front Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload front image</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Back Image (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload back image</p>
                </div>
              </div>
              
              <Button className="w-full">Save Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((document) => {
          const DocumentIcon = getDocumentIcon(document.type);
          const isVisible = visibleNumbers.includes(document.id);
          
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getDocumentColor(document.type)}`}>
                    <DocumentIcon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">
                        {documentTypes.find(t => t.value === document.type)?.label}
                      </h3>
                      {document.isPrimary && (
                        <Badge className="text-xs bg-primary/10 text-primary">Primary</Badge>
                      )}
                      {document.expiryDate && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          Expires {new Date(document.expiryDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{document.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Number:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">
                            {isVisible ? document.documentNumber : maskDocumentNumber(document.documentNumber, document.type)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleNumberVisibility(document.id)}
                          >
                            {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(document.documentNumber, 'Document number')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Added:</span>
                        <span>{document.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first document'
              }
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsSection;
