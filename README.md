# DSA Preparation Tracker (MERN)

Repository Name: `dsa-prep-tracker`

A full-stack multi-user DSA preparation tracker built with MongoDB, Express, React, and Node.js.
Each user gets a personal dashboard, spaced-repetition revision queue, analytics, bookmarks, and company-wise sheets.

## Features

- JWT authentication (register/login/profile)
- Multi-user isolated progress tracking
- 150 seeded LeetCode-style problems
- 20 seeded DSA pattern notes
- Mark solved with attempt history + spaced repetition
- Revision buckets: overdue, due today, upcoming
- In-app notifications
- Company-wise sheets (FAANG + other companies)
- Analytics dashboard (charts + heatmap)
- Weekly planner + leaderboard
- Light/Dark theme with mobile responsive UI

## Tech Stack

- Frontend: React + Vite, Tailwind CSS, Recharts, Axios
- Backend: Node.js, Express.js, Mongoose, JWT, bcrypt
- Database: MongoDB Atlas / MongoDB local

## Project Structure

```text
client/   # React frontend
server/   # Express backend
```

## Environment Variables

Create root `.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Run Locally

```bash
npm install
npm install --prefix server
npm install --prefix client
```

Seed data:

```bash
npm run seed:problems
npm run seed:patterns
```

Start both frontend and backend:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`



## Screenshots

### Login
![Login](./docs/screenshots/login.png)

### Register
![Register](./docs/screenshots/register.png)

### Company Sheets
![Company Sheets](./docs/screenshots/company-sheets.png)

## API Highlights

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/problems`
- `GET /api/problems/companies`
- `GET /api/problems/company/:companyName`
- `GET /api/problems/faang-top`
- `GET /api/patterns`
- `GET /api/user-problems/dashboard`

## License

MIT


