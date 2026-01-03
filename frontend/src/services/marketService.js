import axios from 'axios';

export const marketService = {
  async getApprovedListings() {
    const res = await axios.get('http://localhost:5000/api/admin/market-listings');
    //console.log(res.data);
    return res.data;
  }
};
