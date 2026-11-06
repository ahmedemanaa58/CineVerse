# 🎬 CineVerse — Discover. Rate. Review. 

**CineVerse** is a full-stack movie and TV discovery platform where users can explore trending titles, manage their personal libraries, rate movies and TV shows, and share their opinions through community reviews.

Built with React, Node.js, Express, MongoDB, and The Movie Database (TMDB) API, CineVerse combines a cinematic user interface with a RESTful backend and personalized user experiences.

---

## ✨ Features

### 🎥 Movie & TV Discovery
- Browse trending movies and TV shows.
- Explore movie and TV show details.
- Search titles by name and media type.
- View posters, backdrops, descriptions, genres, release information, and TMDB ratings.
- Fallback artwork for titles with missing images.

### 👤 Authentication
- User registration and login.
- Password hashing with bcrypt.
- JWT-based authentication.
- Protected routes for user-specific operations.

### 📚 Personal Library
- Add and remove titles from your **Watchlist**.
- Add and remove titles from **Favourites**.
- Retrieve your personal library.
- Support for both movies and TV shows.

### ⭐ Rating System
- Submit a personal rating for a movie or TV show.
- Update your existing rating.
- Retrieve community average ratings.
- Display the number of users who rated each title.
- Keep TMDB ratings separate from CineVerse community ratings.

### 💬 Community Reviews
- Publish multiple written reviews for the same title.
- Retrieve reviews with pagination.
- Edit your own reviews.
- Delete your own reviews.
- Display reviewer information and publication dates.
- Enforce review ownership through authenticated backend operations.

### 🎨 User Interface
- Dark cinematic design with purple accents.
- Featured content and trending sections.
- Responsive layouts.
- Interactive movie and TV details.
- Separate rating and review experiences.
- Personalized library management.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript, HTML5, CSS3 |
| Build Tool | Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Validation | Joi |
| External API | TMDB API |
| HTTP Client | Axios |
| Middleware | CORS, Express JSON middleware |

---

## 🏗️ Project Architecture

CineVerse follows a client-server architecture.

```text
CineVerse/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   └── dbConfig.js
│   │
│   ├── controller/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── validation/
│   │
│   └── index.js
│
└── .gitignore
```

### Backend Design

The backend is organized into separate responsibilities:

- **Routes:** Define API endpoints and connect requests to controllers.
- **Controllers:** Handle application logic and HTTP responses.
- **Models:** Define MongoDB document structures using Mongoose.
- **Middleware:** Handle authentication and request validation.
- **Services:** Manage external API communication, including TMDB.
- **Config:** Handle database configuration and connection.

---

## 🔌 API Documentation

Base URL (local development):

```text
http://localhost:8080/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve the authenticated user |

### Movies & TV Shows

| Method | Endpoint | Description |
|---|---|---|
| GET | `/movies/trending` | Retrieve trending titles |
| GET | `/movies/search?query=...&type=movie` | Search titles |
| GET | `/movies/:id?type=movie` | Retrieve title details |

Supported media types: `movie` and `tv`.

### Personal Library

All library endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/library` | Retrieve the user's library |
| POST | `/library/watchlist` | Add a title to the watchlist |
| DELETE | `/library/watchlist/:mediaType/:tmdbId` | Remove a title from the watchlist |
| POST | `/library/favourites` | Add a title to favourites |
| DELETE | `/library/favourites/:mediaType/:tmdbId` | Remove a title from favourites |

### Ratings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/ratings/:mediaType/:tmdbId` | Retrieve rating information |
| POST | `/ratings/:mediaType/:tmdbId/rate` | Submit or update a rating |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reviews/:mediaType/:tmdbId` | Retrieve reviews |
| POST | `/reviews/:mediaType/:tmdbId` | Publish a review |
| PATCH | `/reviews/:mediaType/:tmdbId/:id` | Update a review |
| DELETE | `/reviews/:mediaType/:tmdbId/:id` | Delete a review |

Protected endpoints require a valid JWT access token.

---

## ⚙️ Getting Started

Follow these instructions to run CineVerse locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) database
- [TMDB API account](https://www.themoviedb.org/)

### 1. Clone the repository

```bash
git clone https://github.com/ahmedemanaa58/CineVerse.git

cd CineVerse
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=8080
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=your_jwt_expiration
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
```

Replace the placeholder values with your own credentials.

**Important:** Never commit your actual `.env` file or expose your API credentials.

### 3. Start the backend

```bash
npm run start
```

The backend will run at:

```text
http://localhost:8080
```

### 4. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

The frontend uses a Vite development proxy to forward `/api` requests to the backend running on port `8080`.

---

## 🔐 Security

- Passwords are hashed using bcrypt.
- JWT authentication protects user-specific endpoints.
- Joi validates incoming review data.
- Review ownership is checked before editing or deleting.
- Environment variables are used for sensitive configuration.
- CORS middleware is enabled on the backend.

---

## 🌐 External API

CineVerse uses [The Movie Database (TMDB)](https://www.themoviedb.org/) API to retrieve movie and television data, including trending titles, search results, details, images, and external ratings.

This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## 🚀 Future Improvements

Potential enhancements for future development:

- User profile pages and profile customization.
- Advanced filtering by genre, release year, and rating.
- Personalized movie recommendations.
- Watch history and viewing progress.
- Social interactions between users.
- Deployment and production environment configuration.
- Automated backend testing and API documentation.

---

## 👨‍💻 Author

**Ahmed Emana**

GitHub: [@ahmedemanaa58](https://github.com/ahmedemanaa58)

Project: [CineVerse](https://github.com/ahmedemanaa58/CineVerse)

---

*Built with passion for movies, technology, and full-stack development. 🎬*
