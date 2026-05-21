import axios from 'axios';
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

  // Rewrite URLs to point to our proxy endpoint to bypass Referer block in browser
  if (result && result.sources) {
    const referer = result.headers?.Referer || 'https://kwik.cx/';
    result.sources = result.sources.map((source) => {
      if (source.url) {
        const host = req.get('host');
        const protocol = req.protocol;
        const proxyUrl = `${protocol}://${host}/api/v1/animes/external/proxy?url=${encodeURIComponent(
          source.url
        )}&referer=${encodeURIComponent(referer)}`;
        return {
          ...source,
          url: proxyUrl,
        };
      }
      return source;
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Streaming sources fetched successfully',
    data: result,
  });
});

// 5. Proxy external stream requests to bypass Referer restrictions
const proxyStream = catchAsync(async (req, res) => {
  const { url, referer } = req.query;

  if (!url) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'URL is required',
    });
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };

  if (referer) {
    headers['Referer'] = referer;
  }

  const isM3U8 = url.includes('.m3u8');

  if (isM3U8) {
    const response = await axios.get(url, {
      headers,
      responseType: 'text',
    });

    let content = response.data;
    const host = req.get('host');
    const protocol = req.protocol;
    const proxyBase = `${protocol}://${host}/api/v1/animes/external/proxy`;

    // Rewrite URLs to point to our proxy endpoint to bypass Referer block in browser
    content = content.replace(/(https?:\/\/[^\s",]+)/g, (match) => {
      return `${proxyBase}?url=${encodeURIComponent(match)}&referer=${encodeURIComponent(referer || '')}`;
    });

    // Remap unsupported AAC Main (mp4a.40.1) codec to standard AAC-LC (mp4a.40.2)
    content = content.replace(/mp4a\.40\.1/g, 'mp4a.40.2');

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.send(content);
  } else {
    const response = await axios.get(url, {
      headers,
      responseType: 'stream',
    });

    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }

    response.data.pipe(res);
  }
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
  proxyStream,
};
