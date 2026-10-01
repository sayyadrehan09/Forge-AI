import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Chat from "./models/chat.js";
dotenv.config();

const app = express();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
app.use(cors());
app.use(express.json());

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "ForgeAI backend is running 🚀",
  });
});
// Health check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "ForgeAI Backend",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

  app.get("/api/ai-test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
      contents: "Say hello to ForgeAI in one short sentence.",
    });

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini error:", error.message);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("Received message:", message);

    const chat = new Chat({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: message,
    });

    const reply = response.text;

    console.log("Gemini replied");

    chat.messages.push({
      role: "assistant",
      content: reply,
    });

    console.log("Saving chat...");

    await chat.save();

    console.log("Chat saved successfully:", chat._id);

    res.json({
      reply,
    });
  } catch (error) {
    console.error("Chat error:", error.message);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});