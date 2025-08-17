import express from "express";
import { generateSummary } from "../utils/groqai.js";

const router = express.Router();

// POST /api/summarize
router.post("/summarize", generateSummary);

export default router;
