import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Check karo ki Key mil rahi hai ya nahi
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ API Key missing hai .env file check kar!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeminiAPI() {
  const type = "SQL";
  const difficulty = "easy";
  const totalQuestions = 3; // Chota number rakhte hain testing ke liye
  const topics = ["Joins", "Where Clause"];

  // System instructions jaisa prompt
  const prompt = `Generate exactly ${totalQuestions} ${difficulty} level ${type} questions.
  Topics: ${topics.join(", ")}
  Return ONLY a valid JSON array of objects. No extra text.
  Format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}]`;

  try {
    console.log("🚀 Gemini ko request bhej raha hoon...");

    // ✅ MODEL NAME SAHI KIYA: "gemini-2.0-flash" use karo
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    console.log("📥 Raw Response mil gayi.");

    // ✅ JSON safai ka pakka tarika
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      console.log("✅ API KAAM KAR RAHI HAI! Data niche hai:");
      console.log(JSON.stringify(questions, null, 2));
    } else {
      console.error("❌ JSON format nahi mila response mein:", text);
    }

  } catch (err) {
    // 💡 Yaha error details check karna
    console.error("❌ Error Aa Gaya:");
    if (err.status === 429) {
      console.error("⚠️ Rate Limit Hit: Bhai tera Free Tier quota khatam ho gaya hai. 60 sec ruko.");
    } else {
      console.error(err.message);
    }
  }
}

testGeminiAPI();