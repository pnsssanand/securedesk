// This file should be deleted as it's a Next.js API route and doesn't work with Vite
// Instead, use the existing Firebase-based functions in ../../../services/database.js
// Use saveCard() and getAllCards() functions directly in your React components

import { saveCard, getAllCards } from '../../../services/database';

// Example usage in React components:
// 
// GET cards:
// const cards = await getAllCards(userId);
//
// POST new card:
// const newCard = await saveCard(cardData, userId);

export const cardsApi = {
  // Get all cards for a user
  getCards: async (userId: string) => {
    try {
      const cards = await getAllCards(userId);
      return { success: true, data: cards };
    } catch (error) {
      console.error('Error retrieving cards:', error);
      return { success: false, error: 'Failed to get cards' };
    }
  },

  // Create a new card
  createCard: async (cardData: any, userId: string) => {
    try {
      // Validate required fields
      const { bankName, cardName, cardHolderName, cardNumber, cvv } = cardData;
      if (!bankName || !cardName || !cardHolderName || !cardNumber || !cvv) {
        return { success: false, error: 'Missing required fields' };
      }

      const newCard = await saveCard(cardData, userId);
      console.log('Card created successfully:', newCard.id);
      return { success: true, data: newCard };
    } catch (error) {
      console.error('Error creating card:', error);
      return { success: false, error: 'Failed to create card' };
    }
  }
};
