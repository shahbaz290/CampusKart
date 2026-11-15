import mongoose, { Schema } from "mongoose";

const listSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
        },
        type: {
            type: String,
            enum: ["sell", "donate"],
            required: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        condition: {
            type: String,
            enum: ["new", "good", "fair", "poor"],
            required: true
        },
        images: {
            type: [String]
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["active", "sold", "donated"],
            default: "active"
        },
    }, { timestamps: true }
)

export const Listing = mongoose.model("Listing", listSchema);