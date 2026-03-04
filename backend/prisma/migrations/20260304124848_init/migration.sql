-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HOST', 'MODERATOR', 'PARTICIPANT');

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "videoId" TEXT,
    "playState" TEXT NOT NULL DEFAULT 'paused',
    "currentTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PARTICIPANT',
    "socketId" TEXT,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
