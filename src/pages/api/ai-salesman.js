// pages/api/ai-salesman.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI SDK with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, productContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'A message is required.' });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // --- This is the "Prompt" ---
  // We're telling the AI its personality and what it knows.
  const prompt = `You are a friendly and helpful AI Salesman for a collaborative shopping website.
  Your goal is to help users make purchasing decisions.
  Use the following product information as your only source of knowledge:
  ${JSON.stringify(productContext, null, 2)}

  - If the user asks for a product, find it in the provided information and describe it.
  - If the user is unsure between two or more products, compare their features based on the provided data and give a helpful summary of which might be better for them.
  - If you don't have information about a product, say "I'm sorry, I don't have information on that product right now."
  - Keep your answers concise and act like a helpful salesman.
  `;

  try {
    const result = await model.generateContent([prompt, message].join("\n"));
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
}