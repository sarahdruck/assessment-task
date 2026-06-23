import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * פונקציה לרישום משתמש למשחק
 * @param {string} userId 
 * @param {string} gameId 
 */
export async function joinGame(userId, gameId) {
  // 1. בדיקה שהמשחק קיים
  const game = await prisma.game.findUnique({
    where: { id: gameId }
  });

  if (!game) {
    throw new Error("Game not found");
  }

  // בדיקה שהסטטוס שלו הוא Waiting (דרישה: לזרוק שגיאה אם המשחק כבר התחיל)
  if (game.status !== 'Waiting') {
    throw new Error(`Cannot join game. Game status is ${game.status}`);
  }

  // 2. בדיקה האם המשתמש כבר רשום למשחק זה
  const existingParticipant = await prisma.gameParticipant.findUnique({
    where: {
      userId_gameId: { userId, gameId }
    }
  });

  if (existingParticipant) {
    throw new Error("User is already registered for this game");
  }

  // 3. רישום המשתמש לטבלת הקשר בתפקיד Player
  const newParticipant = await prisma.gameParticipant.create({
    data: {
      userId: userId,
      gameId: gameId,
      role: 'Player'
    }
  });

  return newParticipant;
}