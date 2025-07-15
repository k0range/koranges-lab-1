# --- Stage 1: Build ---
FROM node:20 AS builder

# /app 配下をビルド作業ディレクトリに
WORKDIR /app

# 1) モノレポのルート package*.json をコピー（キャッシュ効率化）
COPY package.json package-lock.json ./

# 2) backend ワークスペースの package.json を上書きコピー
COPY packages/backend/package.json ./package.json

# 依存インストール（npm workspaces）
RUN npm install --legacy-peer-deps

# 3) backend のソース一式と prisma ディレクトリをコピー
COPY packages/backend ./       # src/ tsconfig.json など
COPY packages/backend/prisma ./prisma

# Prisma Client の生成
RUN npx prisma generate

# TypeScript をビルド（./dist フォルダ生成想定）
RUN npm run build:notype

# --- Stage 2: Production image ---
FROM node:20-slim

# 非 root ユーザー作成
RUN useradd --user-group --create-home --shell /bin/false appuser

WORKDIR /app

# ビルド成果物だけコピー
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

USER appuser

# 起動時にマイグレーション＆サーバ起動
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.cjs"]
