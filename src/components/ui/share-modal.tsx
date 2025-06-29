import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Smartphone, Mail, Twitter, MessageSquare, Share2 } from 'lucide-react';
import {
  shareViaWebShare,
  getWhatsAppShareUrl,
  getMessengerShareUrl,
  getEmailShareUrl,
  getTwitterShareUrl
} from '@/utils/sharing-utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onCopyToClipboard: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onCopyToClipboard
}) => {
  const handleWebShare = async () => {
    const success = await shareViaWebShare(title, content);
    if (success) {
      onClose();
    }
  };

  const openShareUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Bank Details</DialogTitle>
          <DialogDescription>
            Choose how you want to share this information
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-muted/30 rounded-md mb-4">
          <pre className="whitespace-pre-wrap text-sm font-mono">{content}</pre>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center p-3 h-auto space-y-1"
            onClick={onCopyToClipboard}
          >
            <Copy className="h-5 w-5 mb-1" />
            <span className="text-xs">Copy</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-3 h-auto space-y-1"
            onClick={handleWebShare}
          >
            <Share2 className="h-5 w-5 mb-1" />
            <span className="text-xs">Share</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-3 h-auto space-y-1 bg-green-500/10 hover:bg-green-500/20"
            onClick={() => openShareUrl(getWhatsAppShareUrl(content))}
          >
            <Smartphone className="h-5 w-5 mb-1 text-green-500" />
            <span className="text-xs">WhatsApp</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-3 h-auto space-y-1 bg-blue-500/10 hover:bg-blue-500/20"
            onClick={() => openShareUrl(getMessengerShareUrl(content))}
          >
            <MessageSquare className="h-5 w-5 mb-1 text-blue-500" />
            <span className="text-xs">Messenger</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-3 h-auto space-y-1 bg-blue-400/10 hover:bg-blue-400/20"
            onClick={() => openShareUrl(getTwitterShareUrl(content))}
          >
            <Twitter className="h-5 w-5 mb-1 text-blue-400" />
            <span className="text-xs">Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-3 h-auto space-y-1 bg-red-500/10 hover:bg-red-500/20"
            onClick={() => openShareUrl(getEmailShareUrl(`Bank Account Details - ${title}`, content))}
          >
            <Mail className="h-5 w-5 mb-1 text-red-500" />
            <span className="text-xs">Email</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
