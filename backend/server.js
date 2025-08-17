import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { generateSummary } from "./utils/groqai.js";

dotenv.config();

const app = express();

// Built-in Express middleware (no body-parser needed)
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Built-in JSON parser
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Built-in URL-encoded parser

// Debug middleware (remove in production)
app.use((req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

// --- Route 1: Summarize ---
app.post("/summarize", generateSummary);

// --- Route 2: Share via Email ---
app.post("/share", async (req, res) => {
  const { summary, recipients } = req.body;
  if (!summary || !recipients) {
    return res.status(400).json({ error: "Summary and recipients required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const recipientsList = Array.isArray(recipients) ? recipients.join(", ") : recipients;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientsList,
      subject: `Meeting Summary - ${new Date().toLocaleDateString()}`,
      text: summary,
      html: `<h2>Meeting Summary</h2><div>${summary.replace(/\n/g, "<br>")}</div>`
    });

    res.json({ status: "sent" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Extracto Backend API is running!" });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});