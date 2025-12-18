import multer from "multer";
import fs from "fs/promises";
import { createRequire } from "module";
import { indexDocumentText } from "../utils/ragUtils.js";
import { v4 as uuidv4 } from "uuid";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const upload = multer({ dest: "/tmp/uploads" });

export const uploadAndIndex = [
  upload.array("files", 5),

  async (req, res, next) => {
    try {
      if (!req.files?.length)
        return res.status(400).json({ message: "No files uploaded" });

      const sessionId = uuidv4();
      const results = [];

      for (const file of req.files) {
        let text = "";

        if (file.mimetype === "application/pdf") {
          const buffer = await fs.readFile(file.path);
          const parsed = await pdfParse(buffer);
          text = parsed.text || "";
        } else {
          text = await fs.readFile(file.path, "utf8");
        }

        await fs.unlink(file.path);
        text = text.replace(/\s+/g, " ").trim();

        if (text.length < 100) {
          results.push({
            filename: file.originalname,
            success: false
          });
          continue;
        }

        const indexed = await indexDocumentText(text, {
          filename: file.originalname,
          sessionId
        });

        results.push({
          filename: file.originalname,
          success: true,
          docId: indexed.docId,
          chunks: indexed.chunks
        });
      }

      res.json({
        success: true,
        sessionId,
        results
      });
    } catch (err) {
      next(err);
    }
  }
];
