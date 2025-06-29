/**
 * Utilities for sharing content across platforms
 */

interface BankShareDetails {
  bankName: string;
  accountHolderName: string;
  accountType: string; // Added this field
  accountNumber: string;
  ifscCode: string;
}

/**
 * Format bank details into a readable text format
 */
export const formatBankDetailsForSharing = (details: BankShareDetails): string => {
  return `
Bank Name: ${details.bankName}
Account Holder Name: ${details.accountHolderName}
Account Type: ${details.accountType}
Account Number: ${details.accountNumber}
IFSC Code: ${details.ifscCode}
`.trim();
};

/**
 * Share content via Web Share API if supported
 * @returns true if sharing was successful, false otherwise
 */
export const shareViaWebShare = async (title: string, text: string): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text
      });
      return true;
    } catch (error) {
      console.error('Error sharing content:', error);
      return false;
    }
  }
  return false;
};

/**
 * Generate WhatsApp share URL
 */
export const getWhatsAppShareUrl = (text: string): string => {
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/?text=${encodedText}`;
};

/**
 * Generate Facebook Messenger share URL
 */
export const getMessengerShareUrl = (text: string): string => {
  const encodedText = encodeURIComponent(text);
  return `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=YOURAPPID&redirect_uri=${encodeURIComponent(window.location.href)}&quote=${encodedText}`;
};

/**
 * Generate Email share URL
 */
export const getEmailShareUrl = (subject: string, body: string): string => {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Generate Twitter/X share URL
 */
export const getTwitterShareUrl = (text: string): string => {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
};
