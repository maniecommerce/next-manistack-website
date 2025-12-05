import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  banner: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  minEntry: number;
  maxEntry: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      default: "Casino",
    },

    banner: {
      type: String, // Main display image
      required: true,
    },

    images: {
      type: [String], // Array of Cloudinary URLs
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    minEntry: {
      type: Number,
      default: 10,
    },

    maxEntry: {
      type: Number,
      default: 1000,
    },
  },
  { timestamps: true }
);

const GameModel =
  mongoose.models.games || mongoose.model<IGame>("games", GameSchema);

export default GameModel;
