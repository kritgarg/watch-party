import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const createRoomService = async (username) => {
  const room = await prisma.room.create({
    data: {
      participants: {
        create: {
          username,
          role: 'HOST',
        },
      },
    },
    include: {
      participants: true,
    },
  });

  const host = room.participants[0];
  return {
    roomId: room.id,
    participantId: host.id,
    role: host.role,
  };
};

export const joinRoomService = async (roomId, username) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { participants: true },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  // Check if role should be host (in case all left or just by default first is host)
  // According to criteria: First user becomes HOST, others join as PARTICIPANT
  // If we are here, room exists, so user joins as PARTICIPANT.
  const participant = await prisma.participant.create({
    data: {
      roomId,
      username,
      role: 'PARTICIPANT',
    },
  });

  return {
    participantId: participant.id,
    role: participant.role,
  };
};

export const getRoomService = async (roomId) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { participants: true },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  return room;
};

// Function for socket to update socket ID
export const updateParticipantSocket = async (participantId, socketId) => {
  return await prisma.participant.update({
    where: { id: participantId },
    data: { socketId },
  });
};

export const removeParticipantService = async (participantId) => {
  return await prisma.participant.delete({
    where: { id: participantId },
  });
};

export const getParticipantBySocketId = async (socketId) => {
  return await prisma.participant.findFirst({
    where: { socketId },
    include: { room: true },
  });
};

export const assignRoleService = async (participantId, newRole) => {
  return await prisma.participant.update({
    where: { id: participantId },
    data: { role: newRole },
  });
};

export const updateRoomStateService = async (roomId, updateData) => {
  return await prisma.room.update({
    where: { id: roomId },
    data: {
      ...updateData,
      lastUpdateTimestamp: Date.now(),
    },
  });
};
