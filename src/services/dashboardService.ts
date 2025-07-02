export interface DashboardStats {
  passwords: number;
  cards: number;
  documents: number;
  banks: number;
  lastUpdated: Date;
}

class DashboardService {
  private baseUrl = '/api';

  async getPasswordCount(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/passwords/count`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching password count:', error);
      return 0;
    }
  }

  async getCardCount(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/cards/count`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching card count:', error);
      return 0;
    }
  }

  async getDocumentCount(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/documents/count`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching document count:', error);
      return 0;
    }
  }

  async getBankCount(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/banks/count`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching bank count:', error);
      return 0;
    }
  }

  async getAllStats(): Promise<DashboardStats> {
    const [passwords, cards, documents, banks] = await Promise.all([
      this.getPasswordCount(),
      this.getCardCount(),
      this.getDocumentCount(),
      this.getBankCount()
    ]);

    return {
      passwords,
      cards,
      documents,
      banks,
      lastUpdated: new Date()
    };
  }
}

export const dashboardService = new DashboardService();
