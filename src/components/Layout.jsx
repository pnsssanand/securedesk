import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// Initialize the database
const db = new Dexie('SecureDeskDB');

// Define database schema
db.version(3).stores({
  passwords: '++id, title, username, url, createdAt, updatedAt, folderId, userId',
  folders: '++id, name, createdAt, userId',
  cards: 'id, type, bankName, cardName, variant, cardNumber, createdAt, userId',
  documents: '++id, title, content, createdAt, userId',
  bankDetails: '++id, bankName, accountNumber, createdAt, userId',
  users: '++id, email, hashedPassword, name'
});

// Encryption key (in production, this would be securely stored)
const ENCRYPTION_KEY = 'your-secure-encryption-key';

// Encrypt sensitive data
const encrypt = (text) => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

// Decrypt sensitive data
const decrypt = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Save a new password to the database
 */
export const savePassword = async (title, username, password, url, notes, folderId = null, userId) => {
  try {
    // Encrypt sensitive information
    const encryptedPassword = encrypt(password);
    
    const timestamp = new Date().toISOString();
    
    // Create password entry
    const passwordEntry = {
      id: uuidv4(),
      title,
      username,
      password: encryptedPassword,
      url,
      notes,
      folderId,
      userId, // Add userId to associate with the current user
      createdAt: timestamp,
      updatedAt: timestamp,
      strength: getPasswordStrength(password)
    };
    
    // Save to database
    const id = await db.passwords.add(passwordEntry);
    console.log('Password saved successfully with ID:', id);
    
    return { ...passwordEntry, id };
  } catch (error) {
    console.error('Error saving password:', error);
    throw error;
  }
};

/**
 * Get all passwords for a specific user
 */
export const getAllPasswords = async (userId) => {
  try {
    const passwords = await db.passwords.where('userId').equals(userId).toArray();
    
    // Decrypt passwords for use
    return passwords.map(pwd => ({
      ...pwd,
      password: decrypt(pwd.password)
    }));
  } catch (error) {
    console.error('Error getting passwords:', error);
    throw error;
  }
};

/**
 * Update existing password
 */
export const updatePassword = async (id, title, username, password, url, notes, folderId, userId) => {
  try {
    const encryptedPassword = encrypt(password);
    
    await db.passwords.update(id, {
      title,
      username,
      password: encryptedPassword,
      url,
      notes,
      folderId,
      updatedAt: new Date().toISOString(),
      strength: getPasswordStrength(password),
      userId // Ensure userId is updated as well
    });
    
    console.log('Password updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Delete password
 */
export const deletePassword = async (id, userId) => {
  try {
    // Only delete if it belongs to the current user
    await db.passwords.where({id: id, userId: userId}).delete();
    console.log('Password deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting password:', error);
    throw error;
  }
};

/**
 * Calculate password strength
 */
const getPasswordStrength = (password) => {
  if (password.length < 8) return 'weak';
  if (password.length < 12) return 'medium';
  return 'strong';
};

/**
 * User authentication functions
 */
export const createUser = async (email, password, name) => {
  try {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const userId = uuidv4();
    
    await db.users.add({
      id: userId,
      email,
      hashedPassword,
      name,
      createdAt: new Date().toISOString()
    });
    
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const user = await db.users.where('email').equals(email).first();
    
    if (!user) {
      return null;
    }
    
    if (user.hashedPassword === hashedPassword) {
      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

/**
 * Bank Details operations
 */

// Save new bank detail
export const saveBankDetail = async (bankDetail, userId) => {
  try {
    // Encrypt sensitive information
    const encryptedAccountNumber = encrypt(bankDetail.accountNumber);
    const encryptedPin = bankDetail.pin ? encrypt(bankDetail.pin) : undefined;
    const encryptedNetBankingId = bankDetail.netBankingId ? encrypt(bankDetail.netBankingId) : undefined;
    const encryptedNetBankingPassword = bankDetail.netBankingPassword ? encrypt(bankDetail.netBankingPassword) : undefined;
    const encryptedCustomerId = bankDetail.customerId ? encrypt(bankDetail.customerId) : undefined;
    
    const timestamp = new Date().toISOString();
    
    // Create bank detail entry
    const bankDetailEntry = {
      id: uuidv4(),
      bankName: bankDetail.bankName,
      accountHolderName: bankDetail.accountHolderName,
      accountNumber: encryptedAccountNumber,
      ifscCode: bankDetail.ifscCode,
      customerId: encryptedCustomerId,
      pin: encryptedPin,
      netBankingId: encryptedNetBankingId,
      netBankingPassword: encryptedNetBankingPassword,
      isPrimary: bankDetail.isPrimary || false,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Save to database
    const id = await db.bankDetails.add(bankDetailEntry);
    console.log('Bank detail saved successfully with ID:', id);
    
    return { ...bankDetailEntry, id };
  } catch (error) {
    console.error('Error saving bank detail:', error);
    throw error;
  }
};

// Get all bank details for a specific user
export const getAllBankDetails = async (userId) => {
  try {
    const bankDetails = await db.bankDetails.where('userId').equals(userId).toArray();
    
    // Decrypt sensitive data for use
    return bankDetails.map(detail => ({
      ...detail,
      accountNumber: decrypt(detail.accountNumber),
      customerId: detail.customerId ? decrypt(detail.customerId) : undefined,
      pin: detail.pin ? decrypt(detail.pin) : undefined,
      netBankingId: detail.netBankingId ? decrypt(detail.netBankingId) : undefined,
      netBankingPassword: detail.netBankingPassword ? decrypt(detail.netBankingPassword) : undefined
    }));
  } catch (error) {
    console.error('Error getting bank details:', error);
    throw error;
  }
};

// Update existing bank detail
export const updateBankDetail = async (id, bankDetail, userId) => {
  try {
    // Encrypt sensitive information
    const encryptedAccountNumber = encrypt(bankDetail.accountNumber);
    const encryptedPin = bankDetail.pin ? encrypt(bankDetail.pin) : undefined;
    const encryptedNetBankingId = bankDetail.netBankingId ? encrypt(bankDetail.netBankingId) : undefined;
    const encryptedNetBankingPassword = bankDetail.netBankingPassword ? encrypt(bankDetail.netBankingPassword) : undefined;
    const encryptedCustomerId = bankDetail.customerId ? encrypt(bankDetail.customerId) : undefined;
    
    await db.bankDetails.update(id, {
      bankName: bankDetail.bankName,
      accountHolderName: bankDetail.accountHolderName,
      accountNumber: encryptedAccountNumber,
      ifscCode: bankDetail.ifscCode,
      customerId: encryptedCustomerId,
      pin: encryptedPin,
      netBankingId: encryptedNetBankingId,
      netBankingPassword: encryptedNetBankingPassword,
      isPrimary: bankDetail.isPrimary,
      updatedAt: new Date().toISOString(),
      userId
    });
    
    console.log('Bank detail updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating bank detail:', error);
    throw error;
  }
};

// Delete bank detail
export const deleteBankDetail = async (id, userId) => {
  try {
    // Only delete if it belongs to the current user
    await db.bankDetails.where({ id: id, userId: userId }).delete();
    console.log('Bank detail deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting bank detail:', error);
    throw error;
  }
};

// Save new card
export const saveCard = async (cardData, userId) => {
  try {
    // Encrypt sensitive information
    const encryptedCardNumber = encrypt(cardData.cardNumber);
    const encryptedCvv = encrypt(cardData.cvv);
    
    const timestamp = new Date().toISOString();
    
    // Create card entry with generated ID
    const cardId = uuidv4();
    const cardEntry = {
      id: cardId,
      type: cardData.type,
      bankName: cardData.bankName,
      cardName: cardData.cardName,
      variant: cardData.variant,
      cardNumber: encryptedCardNumber,
      cvv: encryptedCvv,
      validFrom: cardData.validFrom,
      validTo: cardData.validTo,
      color: cardData.color,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Save to database
    await db.cards.add(cardEntry);
    console.log('Card saved successfully with ID:', cardId);
    
    // Return decrypted card for UI use
    return {
      ...cardEntry,
      cardNumber: cardData.cardNumber,
      cvv: cardData.cvv
    };
  } catch (error) {
    console.error('Error saving card:', error);
    throw error;
  }
};

// Get all cards for a specific user
export const getAllCards = async (userId) => {
  try {
    const cards = await db.cards.where('userId').equals(userId).toArray();
    
    // Decrypt card data for use
    return cards.map(card => ({
      ...card,
      cardNumber: decrypt(card.cardNumber),
      cvv: decrypt(card.cvv)
    }));
  } catch (error) {
    console.error('Error getting cards:', error);
    throw error;
  }
};

// Update existing card
export const updateCard = async (id, cardData, userId) => {
  try {
    const encryptedCardNumber = encrypt(cardData.cardNumber);
    const encryptedCvv = encrypt(cardData.cvv);
    
    await db.cards.update(id, {
      type: cardData.type,
      bankName: cardData.bankName,
      cardName: cardData.cardName,
      variant: cardData.variant,
      cardNumber: encryptedCardNumber,
      cvv: encryptedCvv,
      validFrom: cardData.validFrom,
      validTo: cardData.validTo,
      color: cardData.color,
      updatedAt: new Date().toISOString(),
      userId
    });
    
    console.log('Card updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

// Delete card
export const deleteCard = async (id, userId) => {
  try {
    // Only delete if it belongs to the current user
    await db.cards.where({ id: id, userId: userId }).delete();
    console.log('Card deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

export default {
  savePassword,
  getAllPasswords,
  updatePassword,
  deletePassword,
  saveBankDetail,
  getAllBankDetails,
  updateBankDetail,
  deleteBankDetail,
  saveCard,
  getAllCards,
  updateCard,
  deleteCard,
  createUser,
  authenticateUser
};