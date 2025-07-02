import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db } from '../config/firebase';

// Encryption key (stored securely in environment variables in production)
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
 * User authentication functions
 */
export const createUser = async (email, password, name) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with name
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date().toISOString()
    });
    
    return user.uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      id: user.uid,
      name: user.displayName || email.split('@')[0], // Use displayName or fallback
      email: user.email
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

/**
 * Save a new password to the database
 */
export const savePassword = async (title, username, password, url, notes, folderId = null, userId) => {
  try {
    // Encrypt sensitive information
    const encryptedPassword = encrypt(password);
    
    const timestamp = new Date().toISOString();
    const passwordId = uuidv4();
    
    // Create password document
    const passwordData = {
      id: passwordId,
      title,
      username,
      password: encryptedPassword,
      url,
      notes,
      folderId,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      strength: getPasswordStrength(password)
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'passwords', passwordId), passwordData);
    console.log('Password saved successfully with ID:', passwordId);
    
    return { ...passwordData, id: passwordId };
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
    // Query passwords for this user
    const passwordsQuery = query(collection(db, 'passwords'), where('userId', '==', userId));
    const querySnapshot = await getDocs(passwordsQuery);
    
    // Map and decrypt passwords
    const passwords = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        password: decrypt(data.password)
      };
    });
    
    return passwords;
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
    
    const passwordRef = doc(db, 'passwords', id);
    await updateDoc(passwordRef, {
      title,
      username,
      password: encryptedPassword,
      url,
      notes,
      folderId,
      updatedAt: new Date().toISOString(),
      strength: getPasswordStrength(password),
      userId
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
    // Delete password document
    await deleteDoc(doc(db, 'passwords', id));
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

// Save new card
export const saveCard = async (cardData, userId) => {
  try {
    // Encrypt sensitive information
    const encryptedCardNumber = encrypt(cardData.cardNumber);
    const encryptedCvv = encrypt(cardData.cvv);
    
    const timestamp = new Date().toISOString();
    const cardId = uuidv4();
    
    // Create card document
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
    
    // Save to Firestore
    await setDoc(doc(db, 'cards', cardId), cardEntry);
    
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
    const cardsQuery = query(collection(db, 'cards'), where('userId', '==', userId));
    const querySnapshot = await getDocs(cardsQuery);
    
    // Map and decrypt card data
    const cards = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        cardNumber: decrypt(data.cardNumber),
        cvv: decrypt(data.cvv)
      };
    });
    
    return cards;
  } catch (error) {
    console.error('Error getting cards:', error);
    throw error;
  }
};

// Update existing card
export const updateCard = async (id, cardData, userId) => {
  try {
    if (!id || !userId) {
      throw new Error('Missing card ID or user ID for update operation');
    }

    console.log('=== UPDATE CARD REQUEST ===');
    console.log('Card ID:', id);
    console.log('User ID:', userId);
    console.log('Update data:', cardData);
    
    const encryptedCardNumber = encrypt(cardData.cardNumber);
    const encryptedCvv = encrypt(cardData.cvv);
    
    const cardRef = doc(db, 'cards', id);
    
    // First check if the card exists and belongs to this user
    const cardSnapshot = await getDoc(cardRef);
    if (!cardSnapshot.exists()) {
      throw new Error('Card not found');
    }
    
    const existingData = cardSnapshot.data();
    if (existingData.userId !== userId) {
      throw new Error('Not authorized to update this card');
    }
    
    // Prepare update data
    const updateData = {
      type: cardData.type,
      bankName: cardData.bankName,
      cardName: cardData.cardName,
      cardHolderName: cardData.cardHolderName,
      variant: cardData.variant,
      cardNumber: encryptedCardNumber,
      cvv: encryptedCvv,
      validFrom: cardData.validFrom,
      validTo: cardData.validTo,
      color: cardData.color,
      updatedAt: new Date().toISOString(),
      userId
    };
    
    await updateDoc(cardRef, updateData);
    
    console.log('=== UPDATE SUCCESSFUL ===');
    console.log('Card updated successfully');
    
    // Return the updated card data (decrypted for UI use)
    return {
      id,
      ...cardData,
      updatedAt: updateData.updatedAt
    };
  } catch (error) {
    console.error('Error updating card:', error);
    throw new Error(`Failed to update card: ${error.message}`);
  }
};

// Delete card
export const deleteCard = async (id, userId) => {
  try {
    await deleteDoc(doc(db, 'cards', id));
    console.log('Card deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

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
    const bankDetailId = uuidv4();
    
    // Create bank detail entry
    const bankDetailEntry = {
      id: bankDetailId,
      bankName: bankDetail.bankName,
      accountHolderName: bankDetail.accountHolderName,
      accountType: bankDetail.accountType || 'savings', // Added account type with default
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
    
    // Save to Firestore
    await setDoc(doc(db, 'bankDetails', bankDetailId), bankDetailEntry);
    
    console.log('Bank detail saved successfully with ID:', bankDetailId);
    
    return { ...bankDetailEntry, id: bankDetailId };
  } catch (error) {
    console.error('Error saving bank detail:', error);
    throw error;
  }
};

// Get all bank details for a specific user
export const getAllBankDetails = async (userId) => {
  try {
    const bankDetailsQuery = query(collection(db, 'bankDetails'), where('userId', '==', userId));
    const querySnapshot = await getDocs(bankDetailsQuery);
    
    // Decrypt sensitive data for use
    const bankDetails = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        accountNumber: decrypt(data.accountNumber),
        customerId: data.customerId ? decrypt(data.customerId) : undefined,
        pin: data.pin ? decrypt(data.pin) : undefined,
        netBankingId: data.netBankingId ? decrypt(data.netBankingId) : undefined,
        netBankingPassword: data.netBankingPassword ? decrypt(data.netBankingPassword) : undefined
      };
    });
    
    return bankDetails;
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
    
    const bankDetailRef = doc(db, 'bankDetails', id);
    await updateDoc(bankDetailRef, {
      bankName: bankDetail.bankName,
      accountHolderName: bankDetail.accountHolderName,
      accountType: bankDetail.accountType || 'savings', // Added account type with default
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
    await deleteDoc(doc(db, 'bankDetails', id));
    console.log('Bank detail deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting bank detail:', error);
    throw error;
  }
};

/**
 * Document management functions
 */
const storage = getStorage();

// Save new document
export const saveDocument = async (file, documentName, userId) => {
  try {
    const timestamp = new Date().toISOString();
    const documentId = uuidv4();
    const filePath = `documents/${userId}/${documentId}-${file.name}`;
    const storageRef = ref(storage, filePath);

    // Upload file to Firebase Storage
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);

    // Create document entry in Firestore
    const documentEntry = {
      id: documentId,
      name: documentName,
      fileName: file.name,
      fileUrl: fileUrl,
      filePath: filePath,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await setDoc(doc(db, 'documents', documentId), documentEntry);
    console.log('Document saved successfully with ID:', documentId);
    return documentEntry;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};

// Get all documents for a specific user
export const getAllDocuments = async (userId) => {
  try {
    const documentsQuery = query(collection(db, 'documents'), where('userId', '==', userId));
    const querySnapshot = await getDocs(documentsQuery);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (document, userId) => {
  try {
    // Delete file from Firebase Storage
    const storageRef = ref(storage, document.filePath);
    await deleteObject(storageRef);

    // Delete document from Firestore
    await deleteDoc(doc(db, 'documents', document.id));
    console.log('Document deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Add functions to get counts if they don't already exist
export const getItemCounts = async (userId) => {
  try {
    const passwordsQuery = query(
      collection(db, 'passwords'),
      where('userId', '==', userId)
    );
    const passwordsSnapshot = await getDocs(passwordsQuery);
    
    const cardsQuery = query(
      collection(db, 'cards'),
      where('userId', '==', userId)
    );
    const cardsSnapshot = await getDocs(cardsQuery);
    
    const bankDetailsQuery = query(
      collection(db, 'bankDetails'),
      where('userId', '==', userId)
    );
    const bankDetailsSnapshot = await getDocs(bankDetailsQuery);
    
    const documentsQuery = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );
    const documentsSnapshot = await getDocs(documentsQuery);
    
    return {
      passwords: passwordsSnapshot.size,
      bankCards: cardsSnapshot.size,
      bankDetails: bankDetailsSnapshot.size,
      documents: documentsSnapshot.size
    };
  } catch (error) {
    console.error('Error getting item counts:', error);
    throw error;
  }
};

// New function for real-time item counts
export const subscribeToItemCounts = (userId, callback) => {
  if (!userId) return () => {};

  // Set up queries for each collection
  const passwordsQuery = query(
    collection(db, 'passwords'),
    where('userId', '==', userId)
  );
  
  const cardsQuery = query(
    collection(db, 'cards'),
    where('userId', '==', userId)
  );
  
  const bankDetailsQuery = query(
    collection(db, 'bankDetails'),
    where('userId', '==', userId)
  );
  
  const documentsQuery = query(
    collection(db, 'documents'),
    where('userId', '==', userId)
  );
  
  // Set up real-time listeners
  const unsubscribePasswords = onSnapshot(passwordsQuery, (snapshot) => {
    callback('passwords', snapshot.size);
  }, (error) => {
    console.error('Error in passwords listener:', error);
  });
  
  const unsubscribeCards = onSnapshot(cardsQuery, (snapshot) => {
    callback('bankCards', snapshot.size);
  }, (error) => {
    console.error('Error in cards listener:', error);
  });
  
  const unsubscribeBankDetails = onSnapshot(bankDetailsQuery, (snapshot) => {
    callback('bankDetails', snapshot.size);
  }, (error) => {
    console.error('Error in bank details listener:', error);
  });
  
  const unsubscribeDocuments = onSnapshot(documentsQuery, (snapshot) => {
    callback('documents', snapshot.size);
  }, (error) => {
    console.error('Error in documents listener:', error);
  });
  
  // Return a cleanup function that unsubscribes from all listeners
  return () => {
    unsubscribePasswords();
    unsubscribeCards();
    unsubscribeBankDetails();
    unsubscribeDocuments();
  };
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
  authenticateUser,
  saveDocument,
  getAllDocuments,
  deleteDocument,
  getItemCounts,
  subscribeToItemCounts
};
