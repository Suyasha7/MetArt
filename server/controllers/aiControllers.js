import catchAsyncError from "../utility/catchAsyncError.js";
import ErrorHandler from "../utility/errorHandler.js";
import { appraiseArtwork } from "../services/aiService.js";

/**
 * Handles the visual appraisal of an uploaded artwork file.
 * Receives the image file from Multer, converts it to base64, 
 * and passes it directly to Google Gemini Vision.
 */
export const appraiseUploadedImage = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("No artwork image provided for appraisal.", 400));
  }

  try {
    const extname = req.file.originalname.split(".")[1] || "jpeg";
    const mimeType = `image/${extname === 'jpg' ? 'jpeg' : extname}`;
    const base64Data = req.file.buffer.toString("base64");

    console.log("Analyzing artwork via Google Gemini Visual Appraisal Co-Pilot...");
    const appraisalResult = await appraiseArtwork(mimeType, base64Data);

    res.status(200).json({
      success: true,
      message: "Artwork successfully appraised by AI Co-Pilot!",
      appraisal: appraisalResult
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
