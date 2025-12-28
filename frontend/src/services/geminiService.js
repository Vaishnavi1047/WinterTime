import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export const generateAdvisorResponse = async (user, recentLog, userMessage) => {
  if (!import.meta.env.VITE_GOOGLE_API_KEY) {
    return "AI is offline. Please add your Gemini API key.";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are the CREDITCarbon Advisor assistant."
    });

    const context = `User: ${user.companyName}, Sector: ${user.sector}`;
    const result = await model.generateContent(
      `Context: ${context}\n\nQuestion: ${userMessage}`
    );

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now.";
  }
};
