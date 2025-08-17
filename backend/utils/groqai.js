import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import { Groq } from "groq-sdk"; // ✅ import Groq

// Instantiate Groq client with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateSummary = async (req, res) => {
  const { transcript, prompt } = req.body;
  if (!transcript || !prompt) {
    return res.status(400).json({ error: "Transcript and prompt required" });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `${prompt}\n\nTranscript:\n${transcript}` }
      ],
    });

    const summary = response.choices[0]?.message?.content || "No summary generated.";
    res.json({ summary });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
