// Import the Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";
// ...existing code...

/**
 * Calls the Gemini API with a given prompt and returns the response using the official SDK.
 * @param {string} prompt - The prompt to send to Gemini.
 * @returns {Promise<string>} - The response from Gemini.
 */
export async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY; // Replace with your Gemini API key
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "";
  }
}
// ...existing code...
