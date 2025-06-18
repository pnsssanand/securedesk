import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// Initialize the database
const db = new Dexie('SecureDeskDB');

// Define database schema
db.version(2).stores({
  passwords: '++id, title, username, url, createdAt, updatedAt, folderId, userId',
  folders: '++id, name, createdAt, userId',
  cards: '++id, title, cardNumber, expiryDate, createdAt, userId',
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

export default {
  savePassword,
  getAllPasswords,
  updatePassword,
  deletePassword,
  createUser,
  authenticateUser
};
