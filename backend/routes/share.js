import express from "express";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { summary, recipients } = req.body;

  if (!summary || !recipients || (Array.isArray(recipients) && recipients.length === 0)) {
    return res.status(400).json({ error: "Summary and recipients required" });
  }

  try {
    // Prepare HTML content
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            h2 { color: #333; }
            hr { margin: 20px 0; }
            p { font-size: 14px; }
          </style>
        </head>
        <body>
          <h2>Meeting Summary</h2>
          <div>${summary.replace(/\n/g, "<br>")}</div>
          <hr>
          <p><small>Generated on ${new Date().toLocaleString()}</small></p>
        </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const pdfPath = path.join("./temp", `MeetingSummary-${Date.now()}.pdf`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
    await browser.close();

    // Send email with PDF attachment
    await sendEmail(summary, recipients, pdfPath);

    res.json({ status: "sent" });

    // Optional: delete temp PDF
    fs.unlinkSync(pdfPath);

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

export default router;
