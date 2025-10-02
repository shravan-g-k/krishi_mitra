// Import the Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";
import GEMINI_API_KEY from '../secret';

/**
 * Calls the Gemini API with a given prompt and returns the response using the official SDK.
 * @param {string} prompt - The prompt to send to Gemini.
 * @param {string} base64Image - Optional base64 image data.
 * @returns {Promise<string>} - The response from Gemini.
 */
export async function callGemini(prompt, base64Image = null) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  try {
    let result;
    
    if (base64Image) {
      // Extract the base64 data without the data URL prefix
      const base64Data = base64Image.split(',')[1] || base64Image;
      
      // For image analysis, use multimodal input
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        }
      ]);
    } else {
      // Text-only prompt
      result = await model.generateContent(prompt);
    }
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
}

/**
 * Analyzes an image file and area using Gemini, with timeout and result parsing.
 * @param {File} image - The image file to analyze.
 * @param {string|number} area - The area value (optional).
 * @param {number} maxTime - Timeout in seconds (default 60).
 * @returns {Promise<{result: object|null, error: string|null}>}
 */
export async function analyzeImageWithGemini(image, area, maxTime = 60) {
  if (!image) return { result: null, error: "No image provided" };
  
  // Convert image file to base64
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject('Failed to read image.');
    reader.readAsDataURL(file);
  });

  let timeoutId;
  
  try {
    const base64Image = await toBase64(image);
    
    // Enhanced prompt for better accuracy
    let prompt = `You are an expert agricultural AI assistant. Analyze this farm/crop image carefully and provide detailed farming information.

IMPORTANT: Respond ONLY with a valid JSON object. No markdown, no code blocks, no extra text.

Required JSON format:
{
  "landArea": "number with unit (e.g., '5 acres' or use provided area)",
  "crop": "specific crop name identified in image",
  "growthStage": "current growth stage (e.g., 'Vegetative', 'Flowering', 'Mature')",
  "marketPrice": "estimated market price with currency (e.g., '₹5,000/quintal')",
  "estimatedYield": "estimated yield based on crop and stage (e.g., '3 tons/acre')",
  "harvestTime": "estimated time to harvest (e.g., '45 days', 'Ready to harvest')",
  "healthStatus": "crop health status (e.g., 'Healthy', 'Needs attention')",
  "recommendations": "brief farming recommendations (1-2 sentences)"
}`;

    if (area && area.trim() !== '') {
      prompt += `\n\nProvided land area: ${area} acres. Use this for landArea field.`;
    }

    prompt += `\n\nAnalyze the image and respond with the JSON object only.`;

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('timeout')), maxTime * 1000);
    });

    // Call Gemini with image
    const geminiPromise = callGemini(prompt, base64Image);
    
    const response = await Promise.race([geminiPromise, timeoutPromise]);
    clearTimeout(timeoutId);

    // Clean and parse response
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }
    
    // Try to extract JSON if there's extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    let parsed = null;
    try {
      parsed = JSON.parse(cleanedResponse);
      
      // Validate required fields
      const requiredFields = ['landArea', 'crop', 'growthStage', 'marketPrice', 'estimatedYield', 'harvestTime'];
      const hasAllFields = requiredFields.every(field => parsed[field]);
      
      if (!hasAllFields) {
        console.warn('Missing some required fields, but proceeding with available data');
      }
      
      return { result: parsed, error: null };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was:', cleanedResponse);
      
      // Return raw response as fallback
      return { 
        result: { 
          raw: cleanedResponse,
          error: 'Could not parse AI response as JSON'
        }, 
        error: 'AI response format error. Please try again.' 
      };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.message === 'timeout') {
      return { result: null, error: 'Analysis timed out. Please try again with a smaller image.' };
    }
    
    if (err.message && err.message.includes('API key')) {
      return { result: null, error: 'API configuration error. Please check your API key.' };
    }
    
    console.error('Analysis error:', err);
    return { 
      result: null, 
      error: err.message || 'Failed to analyze image. Please try again.' 
    };
  }
}

/**
 * Helper function to validate Gemini API key
 * @returns {boolean}
 */
export function isGeminiConfigured() {
  return GEMINI_API_KEY && GEMINI_API_KEY.length > 0 && GEMINI_API_KEY !== 'your-api-key-here';
}