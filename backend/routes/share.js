import express from "express";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { summary, recipients } = req.body;

  if (!summary || !recipients || (Array.isArray(recipients) && recipients.length === 0)) {
    return res.status(400).json({ error: "Summary and recipients required" });
  }

  try {
    // Send email directly with the summary
    await sendEmail(summary, recipients);

    res.json({ status: "sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

export default router;
