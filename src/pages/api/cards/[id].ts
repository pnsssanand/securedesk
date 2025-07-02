// This file should be deleted as it's a Next.js API route and doesn't work with Vite
// Instead, use the existing Firebase-based functions in ../../../services/database.js
// Use updateCard() and deleteCard() functions directly in your React components

import { updateCard, deleteCard, getAllCards } from '../../../services/database';

// Example usage in React components:
// 
// GET single card:
// const cards = await getAllCards(userId);
// const card = cards.find(c => c.id === cardId);
//
// PUT update card:
// const updatedCard = await updateCard(cardId, cardData, userId);
//
// DELETE card:
// await deleteCard(cardId, userId);

export const cardByIdApi = {
  // Get a single card by ID
  getCard: async (cardId: string, userId: string) => {
    try {
      const cards = await getAllCards(userId);
      const card = cards.find(c => c.id === cardId);
      
      if (!card) {
        return { success: false, error: 'Card not found' };
      }
      
      return { success: true, data: card };
    } catch (error) {
      console.error('Error retrieving card:', error);
      return { success: false, error: 'Failed to get card' };
    }
  },

  // Update a card
  updateCard: async (cardId: string, cardData: any, userId: string) => {
    try {
      // Validate required fields
      const { bankName, cardName, cardHolderName, cardNumber, cvv } = cardData;
      if (!bankName || !cardName || !cardHolderName || !cardNumber || !cvv) {
        return { success: false, error: 'Missing required fields' };
      }

      const updatedCard = await updateCard(cardId, cardData, userId);
      console.log('Card updated successfully:', cardId);
      return { success: true, data: updatedCard };
    } catch (error) {
      console.error('Error updating card:', error);
      return { success: false, error: 'Failed to update card' };
    }
  },

  // Delete a card
  deleteCard: async (cardId: string, userId: string) => {
    try {
      await deleteCard(cardId, userId);
      console.log('Card deleted successfully:', cardId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting card:', error);
      return { success: false, error: 'Failed to delete card' };
    }
  }
};
