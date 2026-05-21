import axios from 'axios';
import { ANIME } from '@consumet/extensions';
import QueryBuilder from '../../app/utils/queryBuilder.js';
import Anime from './anime.model.js';
import AppError from '../../app/errors/AppError.js';
import httpStatus from '../../app/constants/httpStatus.js';
import config from '../../app/config/index.js';

const animepahe = new ANIME.AnimePahe();
animepahe.baseUrl = 'https://animepahe.pw';

// Create a new anime
const createAnimeIntoDB = async (payload) => {
  // Check for uniqueness
  const existingAnime = await Anime.findOne({ title: payload.title });
  if (existingAnime) {
    throw new AppError(httpStatus.BAD_REQUEST, 'An anime with this title already exists');
  }

  const result = await Anime.create(payload);
  return result;
};

// Retrieve all animes with filtering, searching, and pagination
const getAllAnimesFromDB = async (query) => {
  const animeSearchableFields = ['title', 'description'];

  const animeQuery = new QueryBuilder(Anime.find(), query)
    .search(animeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await animeQuery.modelQuery;
  const meta = await animeQuery.countTotal();

  return {
    meta,
    result,
  };
};

// Retrieve a single anime by ID
const getSingleAnimeFromDB = async (id) => {
  const result = await Anime.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Anime not found');
  }
  return result;
};

// Update an anime by ID
const updateAnimeInDB = async (id, payload) => {
  const existingAnime = await Anime.findById(id);
  if (!existingAnime) {
    throw new AppError(httpStatus.NOT_FOUND, 'Anime not found');
  }

  // If changing title, make sure it is unique
  if (payload.title && payload.title !== existingAnime.title) {
    const duplicate = await Anime.findOne({ title: payload.title });
    if (duplicate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'An anime with this title already exists');
    }
  }

  const result = await Anime.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete an anime by ID
const deleteAnimeFromDB = async (id) => {
  const existingAnime = await Anime.findById(id);
  if (!existingAnime) {
    throw new AppError(httpStatus.NOT_FOUND, 'Anime not found');
  }

  const result = await Anime.findByIdAndDelete(id);
  return result;
};

// --- External API Integration Services ---

// 1. Get Top Anime List from MyAnimeList (Jikan API)
const getTopAnimesFromJikan = async () => {
  try {
    const response = await axios.get(`${config.jikan_api_url}/top/anime`);
    return response.data?.data || [];
  } catch (error) {
    throw new AppError(
      error.response?.status || httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to fetch top anime from Jikan: ${error.message}`
    );
  }
};

// 2. Search Anime from Consumet (AnimePahe provider)
const searchAnimeFromConsumet = async (queryStr) => {
  try {
    if (!queryStr) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Query parameter is required');
    }
    const response = await animepahe.search(queryStr);
    return response || [];
  } catch (error) {
    throw new AppError(
      error.response?.status || httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to search anime from Consumet: ${error.message}`
    );
  }
};

// 3. Get Anime details & episodes from Consumet
const getAnimeInfoFromConsumet = async (animeId) => {
  try {
    const response = await animepahe.fetchAnimeInfo(animeId);
    return response || {};
  } catch (error) {
    throw new AppError(
      error.response?.status || httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to fetch anime details from Consumet: ${error.message}`
    );
  }
};

// 4. Get video streaming links from Consumet
const getAnimeStreamFromConsumet = async (episodeId) => {
  try {
    const response = await animepahe.fetchEpisodeSources(episodeId);
    return response || {};
  } catch (error) {
    throw new AppError(
      error.response?.status || httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to fetch anime stream source from Consumet: ${error.message}`
    );
  }
};

export const AnimeServices = {
  createAnimeIntoDB,
  getAllAnimesFromDB,
  getSingleAnimeFromDB,
  updateAnimeInDB,
  deleteAnimeFromDB,
  getTopAnimesFromJikan,
  searchAnimeFromConsumet,
  getAnimeInfoFromConsumet,
  getAnimeStreamFromConsumet,
};
