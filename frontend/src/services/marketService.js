import axios from 'axios';

export const marketService = {
  async getApprovedListings() {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/market-listings`);
    //console.log(res.data);
    return res.data;
  }
};
