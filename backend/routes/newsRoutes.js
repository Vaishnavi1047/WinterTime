const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/market-news', async (req, res) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    // Specific query for Indian Carbon market, BEE, and CCTS
    const query = encodeURIComponent('(Carbon Market OR "BEE India" OR "Carbon Credit Trading Scheme" OR "CCTS" OR "ESCerts") AND India');
    
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
    );

    // Additional filter to ensure "India" is in the title or description (extra safety)
    const indianNews = response.data.articles.filter(article => 
      article.title.toLowerCase().includes('india') || 
      article.description?.toLowerCase().includes('india') ||
      article.source.name.toLowerCase().includes('india')
    );

    res.json(indianNews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch market news" });
  }
});

module.exports = router;