import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Only initialize if the key exists to prevent the "undefined" crash
const genAI = API_KEY ? new GoogleGenAI(API_KEY) : null;

export const generateAdvisorResponse = async (user, recentLog, userMessage) => {
  // If no API key is found, return a friendly placeholder message instead of crashing
  if (!genAI) {
    console.warn("Gemini API Key missing. AI features are disabled.");
    return "The AI Carbon Advisor is currently in 'Offline Mode'. Please add your Google Gemini API Key to the .env file to enable this feature.";
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the CREDITCarbon Advisor assistant." 
    });

    const context = `User: ${user.companyName}, Sector: ${user.sector}`;
    const result = await model.generateContent(`Context: ${context}\n\nQuestion: ${userMessage}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later!";
  }
};