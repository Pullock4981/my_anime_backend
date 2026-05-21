import express from 'express';
import validateRequest from '../../app/middleware/validateRequest.js';
import { AnimeValidations } from './anime.validation.js';
import { AnimeControllers } from './anime.controller.js';

const router = express.Router();

router
  .route('/')
  .get(AnimeControllers.getAllAnimes)
  .post(
    validateRequest(AnimeValidations.createAnimeValidationSchema),
    AnimeControllers.createAnime
  );

// External API routes (defined before /:id to prevent route parameter collision)
router.get('/external/top', AnimeControllers.getTopAnimes);
router.get('/external/search', AnimeControllers.searchExternalAnime);
router.get('/external/info/:animeId', AnimeControllers.getExternalAnimeInfo);
router.get('/external/stream/:episodeId', AnimeControllers.getExternalAnimeStream);

router
  .route('/:id')
  .get(AnimeControllers.getSingleAnime)
  .put(
    validateRequest(AnimeValidations.updateAnimeValidationSchema),
    AnimeControllers.updateAnime
  )
  .delete(AnimeControllers.deleteAnime);

export const AnimeRoutes = router;
