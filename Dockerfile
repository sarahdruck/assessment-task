FROM node:18-alpine

WORKDIR /app

# העתקת קבצי הגדרות והתקנת תלויות
COPY package*.json ./
RUN npm install

# העתקת כל שאר קבצי הפרויקט
COPY . .

# יצירת קבצי ה-Client של Prisma
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npx prisma generate
# הרצת הסקריפט שמוגדר ב-package.json
CMD ["npm", "start"]