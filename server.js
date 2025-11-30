import express from "express";
import cors from "cors";
import Groq from "groq-sdk/index.mjs";
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});

app.use(limiter);
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Enhanced system prompts for different use cases
const SYSTEM_PROMPTS = {
  default: "You are a helpful social media AI agent. Respond in formatted paragraphs, bullets, steps, include emojis. Analyze images if provided.",
  caption: "You are a creative Instagram caption writer. Create engaging, emoji-rich captions with relevant hashtags.",
  thread: "You are a Twitter thread expert. Create viral, engaging threads with hooks and clear structure.",
  professional: "You are a LinkedIn content strategist. Create professional, value-driven content.",
  analysis: "You are a social media analyst. Analyze images and provide strategic posting recommendations."
};

// Detect intent from message
function detectIntent(message) {
  const msg = message.toLowerCase();
  if (msg.includes('instagram') || msg.includes('caption')) return 'caption';
  if (msg.includes('twitter') || msg.includes('thread')) return 'thread';
  if (msg.includes('linkedin') || msg.includes('professional')) return 'professional';
  if (msg.includes('analyze') || msg.includes('analysis')) return 'analysis';
  return 'default';
}

app.post("/api/chat", async (req, res) => {
  try {
    const { contentArray, history } = req.body;

    if (!contentArray || !Array.isArray(contentArray)) {
      return res.status(400).json({ error: "Invalid content format" });
    }

    // Detect user intent
    const userMessage = contentArray.find(item => item.type === "text")?.text || "";
    const intent = detectIntent(userMessage);
    const systemPrompt = SYSTEM_PROMPTS[intent];

    let messages = [{ role: "system", content: systemPrompt }];

    // Add history with token management (keep last 10 messages)
    if (history && history.length) {
      history.slice(-10).forEach(h => {
        if (Array.isArray(h.content)) {
          let formattedContent = [];
          h.content.forEach(item => {
            if (item.type === "text") {
              formattedContent.push({ type: "text", text: item.text });
            } else if (item.type === "image_url") {
              formattedContent.push({
                type: "image_url",
                image_url: { url: item.image_url }
              });
            }
          });
          messages.push({ role: h.role, content: formattedContent });
        } else {
          messages.push({ role: h.role, content: h.content });
        }
      });
    }

    // Format current message
    let formattedContent = [];
    let hasImage = false;

    contentArray.forEach(item => {
      if (item.type === "text" && item.text.trim()) {
        formattedContent.push({ type: "text", text: item.text });
      } else if (item.type === "image_url") {
        hasImage = true;
        formattedContent.push({
          type: "image_url",
          image_url: { url: item.image_url }
        });
      }
    });

    if (hasImage && formattedContent.length === 1) {
      formattedContent.unshift({ 
        type: "text", 
        text: "Analyze this image in detail and provide social media recommendations." 
      });
    }

    messages.push({ role: "user", content: formattedContent });

    const modelName = hasImage
      ? "llama-3.2-90b-vision-preview"
      : "llama-3.3-70b-versatile";

    console.log("🚀 Using model:", modelName);
    console.log("🎯 Intent detected:", intent);
    console.log("📝 Message count:", messages.length);

    const completion = await groq.chat.completions.create({
      model: modelName,
      messages,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9
    });

    const answer = completion.choices?.[0]?.message?.content;
    
    if (!answer || answer.trim() === "") {
      return res.json({ 
        content: "I couldn't generate a response. Please try again.", 
        success: true 
      });
    }

    // Log usage for monitoring
    console.log("✅ Response generated:", answer.substring(0, 50) + "...");

    res.json({ content: answer, success: true, intent });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ 
      error: `Error: ${err.message}`, 
      success: false 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));