import catchAsyncError from "../utility/catchAsyncError.js";
import ErrorHandler from "../utility/errorHandler.js";
import { Space } from "../models/spaceModel.js";
import { Art } from "../models/artModel.js";
import { generateLiveCommentary } from "../services/openaiService.js";

// Create a new Exhibition Space
export const createSpace = catchAsyncError(async (req, res, next) => {
    const { name, description, theme, artworks } = req.body;

    if (!name || !description) {
        return next(new ErrorHandler("Please enter both the Space name and description!", 400));
    }

    const space = await Space.create({
        name,
        description,
        theme,
        artworks: artworks || [],
        creator: req.user._id // Expecting authenticated user
    });

    res.status(201).json({
        success: true,
        message: "Exhibition Space created successfully!",
        space
    });
});

// Get all Exhibition Spaces
export const getAllSpaces = catchAsyncError(async (req, res, next) => {
    const spaces = await Space.find()
        .populate("creator", "name email")
        .populate("artworks");

    res.status(200).json({
        success: true,
        spaces
    });
});

// Get single Space details
export const getSpaceDetails = catchAsyncError(async (req, res, next) => {
    const space = await Space.findById(req.params.id)
        .populate("creator", "name email")
        .populate("artworks");

    if (!space) {
        return next(new ErrorHandler("Exhibition Space not found!", 404));
    }

    res.status(200).json({
        success: true,
        space
    });
});

// Generate Live AI Curator Commentary
export const getSpaceAICommentary = catchAsyncError(async (req, res, next) => {
    const space = await Space.findById(req.params.id).populate("artworks");

    if (!space) {
        return next(new ErrorHandler("Exhibition Space not found!", 404));
    }

    const commentaryText = await generateLiveCommentary(
        space.name,
        space.description,
        space.artworks
    );

    res.status(200).json({
        success: true,
        commentary: commentaryText
    });
});

// AI Space Matcher Algorithm
export const matchSpaceToPreferences = catchAsyncError(async (req, res, next) => {
    const { theme, maxPrice, preferredCategory } = req.body;

    const spaces = await Space.find().populate("artworks").populate("creator", "name");

    const matchedSpaces = spaces.map(space => {
        let score = 50; // Base score
        let matchReason = [];

        // Match by Theme Vibe
        if (theme && space.theme === theme) {
            score += 25;
            matchReason.push(`Matches your preferred aesthetic theme: ${theme}`);
        } else {
            matchReason.push(`Alternative aesthetic: ${space.theme}`);
        }

        // Match by budget constraints
        if (space.artworks && space.artworks.length > 0) {
            const avgPrice = space.artworks.reduce((acc, art) => acc + art.price, 0) / space.artworks.length;
            if (maxPrice && avgPrice <= maxPrice) {
                score += 15;
                matchReason.push(`Average art price ($${Math.round(avgPrice)}) fits your budget`);
            } else if (maxPrice) {
                score -= 10;
                matchReason.push(`Higher-tier collections (average $${Math.round(avgPrice)})`);
            }

            // Match by specific artwork categories
            const categories = space.artworks.map(a => a.category?.toLowerCase());
            if (preferredCategory && categories.includes(preferredCategory.toLowerCase())) {
                score += 10;
                matchReason.push(`Exhibits artworks in your favorite category: ${preferredCategory}`);
            }
        }

        // Clip score between 10% and 98% (no perfect 100% since art is subjective!)
        score = Math.max(10, Math.min(98, score));

        return {
            space,
            score,
            matchReasons: matchReason
        };
    });

    // Sort by compatibility score in descending order
    matchedSpaces.sort((a, b) => b.score - a.score);

    res.status(200).json({
        success: true,
        matches: matchedSpaces
    });
});
