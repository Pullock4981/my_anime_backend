import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Anime title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Anime image URL is required'],
    },
    genres: {
      type: [String],
      required: [true, 'Anime genres are required'],
    },
    rating: {
      type: Number,
      default: 0.0,
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10'],
    },
    episodes: {
      type: Number,
      required: [true, 'Number of episodes is required'],
      min: [1, 'Number of episodes must be at least 1'],
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Anime = mongoose.model('Anime', animeSchema);

export default Anime;
