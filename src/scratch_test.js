import axios from 'axios';

async function verify() {
  try {
    const res1 = await axios.get('http://localhost:5000/');
    console.log("Welcome Route:", res1.data);
    
    const res2 = await axios.get('http://localhost:5000/api/v1/animes/external/top');
    console.log("Top Anime fetched:", res2.data.success);
  } catch (err) {
    console.error("Backend validation failed:", err.message);
  }
}

verify();
