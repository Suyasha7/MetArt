import catchAsyncError from "../utility/catchAsyncError.js";
import ErrorHandler from "../utility/errorHandler.js";
import { appraiseArtwork } from "../services/openaiService.js";

/**
 * Handles the visual appraisal of an uploaded artwork file.
 * Receives the image file from Multer, converts it to base64, 
 * and passes it directly to GPT-4o Vision.
 */
export const appraiseUploadedImage = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("No artwork image provided for appraisal.", 400));
  }

  try {
    const extname = req.file.originalname.split(".")[1] || "jpeg";
    const imageBase64 = `data:image/${extname};base64,${req.file.buffer.toString("base64")}`;

    console.log("Analyzing artwork via OpenAI Visual Appraisal Co-Pilot...");
    const appraisalResult = await appraiseArtwork(imageBase64);

    res.status(200).json({
      success: true,
      message: "Artwork successfully appraised by AI Co-Pilot!",
      appraisal: appraisalResult
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
