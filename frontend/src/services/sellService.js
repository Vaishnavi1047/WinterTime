import { authService } from './authService';

export const sellService = {
  async createListing({ credits, pricePerCredit, projectType }) {
    const token = authService.getToken();
    const response = await fetch('http://localhost:5000/api/sell/sell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ credits, pricePerCredit, projectType })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create listing');
    return data.listing;
  }
};
