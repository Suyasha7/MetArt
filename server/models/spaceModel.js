import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {type: String, required: [true, "Please enter the space name!"]},
    description: {type: String, required: [true, "Please enter the space description!"]},
    theme: {type: String, default: "minimalist", enum: ["minimalist", "vibrant", "classical", "futuristic", "dark-mode"]},
    artworks: [{type: mongoose.Schema.ObjectId, ref: 'Art'}],
    creator: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now}
});

export const Space = mongoose.model("Space", schema);
