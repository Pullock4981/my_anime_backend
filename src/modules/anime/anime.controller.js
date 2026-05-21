import catchAsync from '../../app/utils/catchAsync.js';
import sendResponse from '../../app/utils/sendResponse.js';
import httpStatus from '../../app/constants/httpStatus.js';
import { AnimeServices } from './anime.service.js';

// Create a new anime
const createAnime = catchAsync(async (req, res) => {
  const result = await AnimeServices.createAnimeIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Anime created successfully',
    data: result,
  });
});

// Retrieve all animes (supports filtering, searching, and pagination)
const getAllAnimes = catchAsync(async (req, res) => {
  const { meta, result } = await AnimeServices.getAllAnimesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Animes fetched successfully',
    meta,
    data: result,
  });
});

// Retrieve a single anime by ID
const getSingleAnime = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnimeServices.getSingleAnimeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Anime fetched successfully',
    data: result,
  });
});

// Update an anime by ID
const updateAnime = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnimeServices.updateAnimeInDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Anime updated successfully',
    data: result,
  });
});

// Delete an anime by ID
const deleteAnime = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnimeServices.deleteAnimeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Anime deleted successfully',
    data: result,
  });
});

// --- External API Controllers ---

// 1. Fetch top anime from Jikan
const getTopAnimes = catchAsync(async (req, res) => {
  const result = await AnimeServices.getTopAnimesFromJikan();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Top anime fetched successfully from MyAnimeList',
    data: result,
  });
});

// 2. Search anime using Consumet scraper
const searchExternalAnime = catchAsync(async (req, res) => {
  const { query } = req.query;
  const result = await AnimeServices.searchAnimeFromConsumet(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'External anime search completed successfully',
    data: result,
  });
});

// 3. Get anime details and episodes list from Consumet
const getExternalAnimeInfo = catchAsync(async (req, res) => {
  const { animeId } = req.params;
  const result = await AnimeServices.getAnimeInfoFromConsumet(animeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'External anime information and episodes fetched successfully',
    data: result,
  });
});

// 4. Get video streaming links from Consumet
const getExternalAnimeStream = catchAsync(async (req, res) => {
  const { episodeId } = req.params;
  const result = await AnimeServices.getAnimeStreamFromConsumet(episodeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Streaming sources fetched successfully',
    data: result,
  });
});

export const AnimeControllers = {
  createAnime,
  getAllAnimes,
  getSingleAnime,
  updateAnime,
  deleteAnime,
  getTopAnimes,
  searchExternalAnime,
  getExternalAnimeInfo,
  getExternalAnimeStream,
};
