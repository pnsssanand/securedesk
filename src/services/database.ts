// Import the missing functions from the JavaScript implementation
import { authenticateUser as authenticateUserJs, createUser as createUserJs } from './database.js';

// Re-export the functions
export const authenticateUser = authenticateUserJs;
export const createUser = createUserJs;

/**
 * Save a new card to the database
 */
export const saveCard = async (cardData: any, userId: string): Promise<any> => {
  try {
    // Add logging for debugging
    console.log('Saving card for user:', userId, cardData);
    
    // Make API call to your backend
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...cardData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response from server:', response.status, errorData);
      throw new Error(`Failed to save card: ${response.statusText}`);
    }

    const savedCard = await response.json();
    console.log('Card saved successfully:', savedCard);
    return savedCard;
  } catch (error) {
    console.error('Error saving card:', error);
    throw error;
  }
};

/**
 * Update an existing card in the database
 */
export const updateCard = async (cardId: string, cardData: any, userId: string): Promise<any> => {
  try {
    // Add detailed logging for debugging
    console.log('=== UPDATE CARD REQUEST ===');
    console.log('Card ID:', cardId);
    console.log('User ID:', userId);
    console.log('Update data:', cardData);
    
    // Ensure card ID and user ID are included in the payload
    const payload = {
      id: cardId,
      userId,
      ...cardData
    };

    // Make API call to your backend
    const response = await fetch(`/api/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Check for non-OK responses and handle them properly
    if (!response.ok) {
      let errorMessage = `Server returned status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += `: ${errorData.message || errorData.error || JSON.stringify(errorData)}`;
      } catch (e) {
        // If response isn't JSON, just use status text
        errorMessage += `: ${response.statusText}`;
      }
      console.error('Update error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Parse the response
    const updatedCard = await response.json();
    
    console.log('=== UPDATE SUCCESSFUL ===');
    console.log('Updated card data:', updatedCard);
    
    // Return the updated card
    return updatedCard;
  } catch (error: any) {
    console.error('Error updating card:', error.message || error);
    // Rethrow with additional context
    throw new Error(`Failed to update card: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Get all cards for a user
 */
export const getAllCards = async (userId: string): Promise<any[]> => {
  try {
    console.log('Fetching cards for user:', userId);
    
    // Make API call to your backend
    const response = await fetch(`/api/cards?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error response from server:', response.status);
      throw new Error(`Failed to fetch cards: ${response.statusText}`);
    }

    const cards = await response.json();
    console.log('Fetched cards successfully:', cards.length);
    return cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

/**
 * Delete a card from the database
 */
export const deleteCard = async (cardId: string, userId: string): Promise<void> => {
  try {
    console.log('Deleting card:', cardId, 'for user:', userId);
    
    // Make API call to your backend
    const response = await fetch(`/api/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error('Error response from server:', response.status);
      throw new Error(`Failed to delete card: ${response.statusText}`);
    }

    console.log('Card deleted successfully');
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};
