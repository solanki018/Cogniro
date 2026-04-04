import { GoogleGenAI } from "@google/genai";

// ➤ Replace this with your Google AI Studio API key
const apiKey = "AIzaSyCPSfyaLClIoCgPohuzez3WxpZtsrJDFuw";

const ai = new GoogleGenAI({ apiKey });

async function testGeminiFlash() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",   // Gemini Flash model
      contents: "Hello! Are you working?",
    });

    console.log("🔥 Gemini Flash Response:");
    console.log(response.text);
  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
}

testGeminiFlash();
