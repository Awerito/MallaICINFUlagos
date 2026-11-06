FROM node:26-alpine AS build
WORKDIR /app
RUN npm install -g pnpm@12
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_SITE_URL
RUN test -n "$VITE_SITE_URL" || { echo "VITE_SITE_URL build arg is required (public URL, see sample.env)"; exit 1; }
RUN VITE_SITE_URL="$VITE_SITE_URL" pnpm build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
