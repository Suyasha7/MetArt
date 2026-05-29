import express from "express";
import { isAuthenticated, isCreator } from "../middleware/authMiddleware.js";
import {
    createSpace,
    getAllSpaces,
    getSpaceDetails,
    getSpaceAICommentary,
    matchSpaceToPreferences
} from "../controllers/spaceControllers.js";

const router = express.Router();

// Public routes
router.route("/spaces").get(getAllSpaces);
router.route("/space/match").post(matchSpaceToPreferences);
router.route("/space/:id").get(getSpaceDetails);
router.route("/space/:id/commentary").get(getSpaceAICommentary);

// Creator-restricted routes
router.route("/space/create").post(isAuthenticated, isCreator, createSpace);

export default router;
