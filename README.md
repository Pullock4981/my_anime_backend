# professional Anime Streaming API Boilerplate

এটি এনিমে স্ট্রিমিং অ্যাপের ব্যাকএন্ডের জন্য একটি প্রফেশনাল এবং প্রোডাকশন-রেডি বয়লারপ্লেট। এখানে ৩-লেয়ার আর্কিটেকচার (Route → Controller → Service → Model) মডুলার স্ট্রাকচার অনুসরণ করা হয়েছে।

---

## 📂 প্রজেক্ট ডিরেক্টরি স্ট্রাকচার

```text
src/
 ├── app/
 │    ├── config/            # পরিবেশ ভেরিয়েবল ও ডেটাবেজ কনফিগারেশন
 │    ├── constants/         # HTTP স্ট্যাটাস কোড কনস্ট্যান্টস
 │    ├── errors/            # কাস্টম এরর ক্লাস (AppError)
 │    ├── middleware/        # গ্লোবাল এরর, নট ফাউন্ড এবং Zod ভ্যালিডেশন মিডলওয়্যার
 │    └── utils/             # catchAsync, sendResponse এবং QueryBuilder
 │
 ├── modules/
 │    └── anime/             # এনিমে মডিউল (Model, Controller, Service, Route, Validation)
 │
 ├── app.js                 # এক্সপ্রেস অ্যাপ কনফিগারেশন ও রাউট মাউন্ট
 └── server.js              # সার্ভার স্টার্টআপ ও ডাটাবেজ কানেকশন
```

---

## 🛠 টেকনোলজি স্ট্যাক
- **Core:** Node.js, Express.js
- **Database & Object Modeling:** MongoDB, Mongoose
- **Validation:** Zod (Request Schema Validation)
- **Security & Logging:** Helmet, CORS, Morgan

---

## ✨ প্রজেক্টের বৈশিষ্ট্য (Boilerplate Features)

1. **৩-লেয়ার আর্কিটেকচার:** ডেটা ফ্লো এবং লজিক্যাল হ্যান্ডলিং সম্পূর্ণ আলাদা (Routes → Controllers → Services → Models)।
2. **Zod রিকোয়েস্ট ভ্যালিডেশন:** রাউট লেভেলেই রিকোয়েস্টের বডি, কুয়েরি এবং প্যারামিটার ভ্যালিডেট করার জন্য রিইউজেবল মিডলওয়্যার।
3. **সেন্ট্রালাইজড এরর হ্যান্ডলিং:** কাস্টম `AppError` ক্লাস, Zod এবং Mongoose এর এররগুলোকে একই ফরম্যাটে রূপান্তর করে।
4. **রিইউজেবল কোড প্যাটার্নস:** `catchAsync` ও `sendResponse` ইউটিলিটি ব্যবহারে কন্ট্রোলার কোড অত্যন্ত পরিষ্কার থাকে।
5. **অ্যাডভান্সড কোয়েরি বিল্ডার (`QueryBuilder`):**
   - **সার্চিং:** এনিমে টাইটেল এবং বর্ণনায় পার্শিয়াল ম্যাচ সার্চ (`?searchTerm=naruto`)।
   - **ফিল্টারিং:** ক্যাটাগরি, রিলিজ বছর ইত্যাদি ফিল্টার করা (`?genres=Action&releaseYear=2020`)।
   - **সোর্টিং:** যেকোনো ফিল্ড দিয়ে সোর্ট করা (`?sort=-rating,title`)।
   - **পেজিনেশন:** পেজ ও লিমিট দিয়ে পেজিনেট করা (`?page=1&limit=5`)।
   - **ফিল্ড সিলেকশন:** নির্দিষ্ট ডেটা ফিল্ড সিলেক্ট করা (`?fields=title,rating`)।

---

## 🚀 রান করার নির্দেশাবলী (Getting Started)

### ১. ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm install
```

### ২. এনভায়রনমেন্ট সেটআপ
`.env.example` ফাইল কপি করে `.env` তৈরি করুন এবং আপনার কানেকশন স্ট্রিং বসান:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/anime_db
NODE_ENV=development
```

### ৩. সার্ভার রান করুন
```bash
# ডেভেলপমেন্ট মোড (Nodemon সহ)
npm run dev

# প্রোডাকশন মোড
npm start
```

---

## 📬 API এন্ডপয়েন্টস এবং রেসপন্স ফরম্যাট

### ১. নতুন এনিমে যোগ করুন
- **Endpoint:** `POST /api/v1/animes`
- **Headers:** `Content-Type: application/json`
- **Request Body (JSON):**
  ```json
  {
    "title": "Demon Slayer",
    "description": "A youth fights demons.",
    "image": "https://example.com/cover.jpg",
    "genres": ["Action", "Fantasy"],
    "rating": 8.7,
    "episodes": 26,
    "releaseYear": 2019
  }
  ```
- **সাকসেস রেসপন্স:**
  ```json
  {
    "success": true,
    "message": "Anime created successfully",
    "data": {
      "_id": "6472...",
      "title": "Demon Slayer",
      "genres": ["Action", "Fantasy"],
      "rating": 8.7,
      "episodes": 26,
      "releaseYear": 2019,
      "createdAt": "2026-05-22...",
      "updatedAt": "2026-05-22..."
    }
  }
  ```

- **ভ্যালিডেশন এরর রেসপন্স (Zod / Mongoose):**
  ```json
  {
    "success": false,
    "message": "Validation Error",
    "errorSources": [
      {
        "path": "image",
        "message": "Image must be a valid URL"
      },
      {
        "path": "episodes",
        "message": "Episodes count is required"
      }
    ]
  }
  ```

### ২. সব এনিমে লিস্ট করুন (সার্চ, ফিল্টার এবং পেজিনেশন সহ)
- **Endpoint:** `GET /api/v1/animes?searchTerm=demon&genre=Action&page=1&limit=10&sort=-rating`
- **সাকসেস রেসপন্স:**
  ```json
  {
    "success": true,
    "message": "Animes fetched successfully",
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPage": 1
    },
    "data": [
      {
        "_id": "6472...",
        "title": "Demon Slayer",
        "rating": 8.7,
        ...
      }
    ]
  }
  ```

### ৩. নির্দিষ্ট আইডি দিয়ে এনিমে দেখুন
- **Endpoint:** `GET /api/v1/animes/:id`
- **ভুল আইডি এরর রেসপন্স:**
  ```json
  {
    "success": false,
    "message": "Anime not found",
    "errorSources": [
      {
        "path": "",
        "message": "Anime not found"
      }
    ]
  }
  ```

### ৪. এক্সটার্নাল এপিআই (Consumet & Jikan Integration)

এই এন্ডপয়েন্টগুলো বাইরের ফ্রি এপিআই (Jikan - MyAnimeList এবং Consumet - Gogoanime Scraper) থেকে রিয়েল-টাইমে সরাসরি ডেটা এনে প্রদর্শন করে:

#### ক. টপ এনিমে লিস্ট (Jikan API)
- **Endpoint:** `GET /api/v1/animes/external/top`
- **Description:** MyAnimeList এর সবচেয়ে জনপ্রিয় এনিমেগুলোর তালিকা নিয়ে আসে।

#### খ. এক্সটার্নাল এনিমে সার্চ (Consumet Scraper)
- **Endpoint:** `GET /api/v1/animes/external/search?query={anime_name}`
- **Example:** `/api/v1/animes/external/search?query=naruto`
- **Description:** Gogoanime স্ক্র্যাপার ব্যবহার করে রিয়েল-টাইমে এনিমে সার্চ করে আইডি ও বিস্তারিত তথ্য নিয়ে আসে।

#### গ. এনিমে ডিটেইলস ও এপিসোড লিস্ট
- **Endpoint:** `GET /api/v1/animes/external/info/:animeId`
- **Example:** `/api/v1/animes/external/info/naruto`
- **Description:** নির্দিষ্ট এনিমের আইডি অনুযায়ী তার সব এপিসোডের তালিকা ও অন্যান্য তথ্য (রিলিজ ডেট, ডেসক্রিপশন ইত্যাদি) রিটার্ন করে।

#### ঘ. এনিমে ভিডিও স্ট্রিম সোর্স (HLS/m3u8 Links)
- **Endpoint:** `GET /api/v1/animes/external/stream/:episodeId`
- **Example:** `/api/v1/animes/external/stream/naruto-episode-1`
- **Description:** নির্দিষ্ট এপিসোডের সরাসরি ভিডিও ফাইল (যেমন `.m3u8` সোর্স ফাইল বা রেফারার লিংক) রিটার্ন করে যা ফ্রন্টএন্ড ভিডিও প্লেয়ারে সরাসরি প্লে করা যায়।

