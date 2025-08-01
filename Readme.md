# 🗳️ VoteNest - Polling App Backend

VoteNest is a polling backend API built with **Node.js**, **Prisma**, and **Express/NestJS** (adjust depending on your framework). It enables users to create, update, delete, and vote on polls—both public and private.

---

## 🚀 Features

- 🔐 **User Authentication**

  - Sign up / Log in (JWT-based)
  - Secured private routes

- 📊 **Poll Management**

  - Create, update, delete, and retrieve polls
  - Each poll includes multiple options
  - Optional public/private visibility

- ✅ **Voting System**
  - Public Polls: anyone can vote using their IP address (no auth needed)
  - Private Polls: only logged-in users can vote
  - One vote allowed per user/IP per poll

---

## 🛠️ Tech Stack

- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL** (or your selected database)
- **JWT for auth**
- **IP-based voting logic**

---

## 🧪 API Endpoints

### 🔐 Auth

- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Login user
- `POST /api/auth/me` — Get logged in user - (auth)
- `POST /api/auth/logout` — Logout user - (auth)

### 📊 Polls

- `POST /api/polls` — Create poll _(auth required)_
- `GET /api/polls` — List all polls
- `GET /api/polls/:id` — Get poll details
- `PUT /api/polls/:id` — Update poll _(auth + owner only)_
- `DELETE /api/polls/:id` — Delete poll _(auth + owner only)_

- `GET /api/polls/public` — List all public polls _(public)_
- `GET /api/polls/public/:id` — Get poll details _(public)_


### 🗳️ Voting

- `POST /api/polls/vote/:id` — Vote on a poll _(auth + owner only)_
- `POST /api/polls/public/vote/:id` — Vote on a poll _(public)_


---

## 🧑‍💻 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/itsbrijeshio/votenest-backend.git
cd votenest-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure `.env`

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/votenest
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=
```

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. Start server

```bash
npm run dev
```

---

## 📦 Future Enhancements (Optional)

- Email verification / password reset
- Realtime vote updates with WebSockets
- Admin dashboard
- Poll expiration dates

---

## 📝 License

MIT License. Free to use and modify!

---

> Built with ❤️ for developers who love open, fair, and secure voting APIs.
