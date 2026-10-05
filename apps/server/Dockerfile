FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/server/package.json apps/server/package.json
COPY packages/shared packages/shared
COPY apps/server apps/server

RUN pnpm install --frozen-lockfile \
    && pnpm --filter @reddit-clone/shared build \
    && pnpm --filter server build

ENV NODE_ENV=production
EXPOSE 5005

CMD ["pnpm", "--filter", "server", "start"]
