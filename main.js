import { PrismaClient } from '@prisma/client';
import { joinGame } from './game.service.js';

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. מתחבר למסד הנתונים
    await prisma.$connect();
    
    // 2. יוצר נתוני דמי של משתמש אחד ומשחק אחד בסטטוס Waiting
    const testUser = await prisma.user.create({
      data: { username: `user_${Date.now()}` } // משתמש עם שם ייחודי כדי שלא ייכשל בהרצות חוזרות
    });

    const testGame = await prisma.game.create({
      data: { status: 'Waiting' }
    });

    // 3. קורא לפונקציה joinGame שיצרת בסעיף הקודם עם הנתונים שנוצרו
    await joinGame(testUser.id, testGame.id);

    // 4. מדפיס ל-Console הודעת הצלחה
    console.log("Success: User joined game");

  } catch (error) {
    // מדפיס את השגיאה אם הפעולה נכשלה
    console.error("Error running main execution:", error.message);
  } finally {
    // ניתוק מסודר מ-Prisma בסיום
    await prisma.$disconnect();
  }
}

main();