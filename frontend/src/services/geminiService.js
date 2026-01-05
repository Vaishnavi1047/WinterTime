export const generateAdvisorResponse = async (user, recentLog, userMessage) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/advisor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        userId: user._id // send userId directly
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Advisor API error:", errData);
      return "I’m having trouble generating a response. Please try again later.";
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Network or API error:", error);
    return "I’m having trouble connecting to the advisor right now.";
  }
};
