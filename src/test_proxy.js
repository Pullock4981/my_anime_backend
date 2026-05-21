import axios from 'axios';

const proxyUrl = 'http://localhost:5000/api/v1/animes/external/proxy';
const targetUrl = 'https://vault-01.uwucdn.top/stream/01/11/41db5d4603e8ed1374f852d3300390d19686ed5fb636916df4063dabebef4036/uwu.m3u8';
const referer = 'https://kwik.cx/';

async function test() {
  const url = `${proxyUrl}?url=${encodeURIComponent(targetUrl)}&referer=${encodeURIComponent(referer)}`;
  console.log("Requesting proxy URL:", url);
  const response = await axios.get(url);
  console.log("Proxy response headers:", response.headers);
  console.log("M3U8 CONTENT FROM PROXY (first 30 lines):");
  const lines = response.data.split('\n');
  console.log(lines.slice(0, 30).join('\n'));
}

test().catch(console.error);
