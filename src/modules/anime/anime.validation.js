import { z } from 'zod';

// Schema for validating anime creation
const createAnimeValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).trim().min(1, 'Title cannot be empty'),
    description: z.string().optional(),
    image: z.string({
      required_error: 'Image URL is required',
    }).url({ message: 'Image must be a valid URL' }),
    genres: z.array(z.string(), {
      required_error: 'Genres are required',
    }).nonempty({ message: 'At least one genre is required' }),
    rating: z.number().min(0).max(10).optional().default(0.0),
    episodes: z.number({
      required_error: 'Episodes count is required',
    }).min(1, 'Episodes must be at least 1'),
    releaseYear: z.number({
      required_error: 'Release year is required',
    }).min(1900, 'Release year must be greater than or equal to 1900'),
  }),
});

// Schema for validating anime updates
const updateAnimeValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().optional(),
    image: z.string().url({ message: 'Image must be a valid URL' }).optional(),
    genres: z.array(z.string()).nonempty().optional(),
    rating: z.number().min(0).max(10).optional(),
    episodes: z.number().min(1).optional(),
    releaseYear: z.number().min(1900).optional(),
  }),
});

export const AnimeValidations = {
  createAnimeValidationSchema,
  updateAnimeValidationSchema,
};
