# WatchParty

WatchParty is a real-time synchronized YouTube video watching application built with a sleek Neo-Brutalism design. Host a room, invite your friends, and watch videos perfectly in sync without messy countdowns.

## Features
- **Real-Time Video Syncing**: Play, pause, and seek video perfectly synchronized across all clients in the room.
- **Role-Based Permissions**: Host, Moderator, and Participant roles. Only the Host and Moderators can control video playback or manage participants.
- **Micro-Latency Handling**: Automatically detects drift and resyncs participants if they lag behind the server source-of-truth.
- **Neo-Brutalism Design**: Clean, high-contrast, playful UI inspired by modern web design aesthetics.
- **Live Participant List**: See who is in the room and what roles they hold.

## Tech Stack
### Frontend
- **Framework**: Next.js (App Router), React
- **Language**: JavaScript
- **Styling**: Vanilla CSS (Global config) + inline styles
- **Real-time**: Socket.IO-client
- **Video Player**: react-youtube (YouTube IFrame API)
- **HTTP Client**: Axios

### Backend
- **Framework**: Node.js, Express
- **Real-time**: Socket.IO
- **Database**: PostgreSQL (Neon Database)
- **ORM**: Prisma
- **Architecture**: Controller-Service-Routing Pattern

## How to Set Up Locally

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL Database (Local or Cloud like Neon)

### 1. Clone the project
```bash
git clone https://github.com/yourusername/watch-party.git
cd watch-party
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```
DATABASE_URL="postgresql://user:password@localhost:5432/watchparty"
FRONTEND_URL="http://localhost:3000"
PORT=4000
```
Run Database Migrations:
```bash
npx prisma db push
npx prisma generate
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```
Create a `.env.local` file (optional, defaults to `http://localhost:4000`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
Start the frontend app:
```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser. Create a new room to become a Host, and copy the Room ID to allow friends to join!

## Deployment to Render

To deploy the **Backend** to Render:

1. **Build Command**: `npm run build` (This automatically runs `npm install && npx prisma generate`)
2. **Start Command**: `npm start` (Runs `node src/server.js`)
3. **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `FRONTEND_URL`: The URL where your frontend is hosted.
   - `PORT`: (Render sets this automatically).

**Troubleshooting Prisma Error on Render**: 
If you encounter a "PrismaClient initialization" or "Prisma error", ensure that `prisma generate` is called during the build phase. The `postinstall` script in `backend/package.json` handles this automatically for you.
