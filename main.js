import { PrismaClient } from '@prisma/client';
import { joinGame } from './game.service.js';

const prisma = new PrismaClient();

async function main() {
  try {
    // התחברות למסד
    await prisma.$connect();
    
    const testUser = await prisma.user.create({
      data: { username: `user_${Date.now()}` }
    });

    const testGame = await prisma.game.create({
      data: { status: 'Waiting' }
    });

    await joinGame(testUser.id, testGame.id);

    console.log("Success: User joined game");

  } catch (error) {
    //ERROR 
    console.error("Error running main execution:", error.message);
  } finally {
    //ניתוק
    await prisma.$disconnect();
  }
}

main();
