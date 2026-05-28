import express from "express";
import { isAuthenticated, isCreator } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/multerMiddleware.js";
import { appraiseUploadedImage } from "../controllers/aiControllers.js";

const router = express.Router();

// AI Art Appraiser endpoint - requires authenticated creator/artist privileges
router.route("/ai/appraise").post(
  isAuthenticated,
  isCreator,
  uploadSingle.single("artImage"),
  appraiseUploadedImage
);

export default router;
