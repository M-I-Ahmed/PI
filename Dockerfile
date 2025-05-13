# 1. Install deps
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# ◀️ This is the missing piece:
RUN npx prisma generate

RUN npm run build

# 3. Run
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public        ./public
COPY --from=builder /app/.next         ./.next
COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/package.json  ./

COPY --from=builder /app/prisma       ./prisma
COPY --from=builder /app/prisma/migrations ./prisma/migrations


EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
