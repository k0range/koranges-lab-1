# --- Stage 1: Build ---
FROM node:20 AS builder

WORKDIR /app

# ルートの package.json + backend の package.json をコピー
COPY ./package.json ./
COPY ./package-lock.json ./
# 自分自身の package.json

# install（npm workspaces 対応）
RUN npm install --legacy-peer-deps

# backend のソースコード + prisma をコピー
COPY . ./
# ここで schema.prisma は ./prisma にある

# Prisma クライアント生成
RUN npx prisma generate

# TypeScript ビルド（distに出力される想定）
RUN npm run build:notype

# --- Stage 2: Run ---
FROM node:20-slim

RUN useradd --user-group --create-home --shell /bin/false appuser

WORKDIR /app

# 必要ファイルだけコピー
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

USER appuser

# 本番DBにmigrateしてから起動
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.cjs"]
