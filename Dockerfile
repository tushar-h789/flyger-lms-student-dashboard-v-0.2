FROM cgr.dev/chainguard/wolfi-base:latest AS bun_wolfi_base

WORKDIR /app

ENV NODE_ENV=production
ARG NEXT_PUBLIC_LOGTO_APP_ID
ARG LOGTO_APP_SECRET
ARG NEXT_PUBLIC_LOGTO_ENDPOINT
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_URL_MAIN
ARG LOGTO_COOKIE_SECRET
ARG NEXT_PUBLIC_API_RESOURCE

# Make build args available as env during build (for static inlining of NEXT_PUBLIC_*)
ENV NEXT_PUBLIC_LOGTO_APP_ID=${NEXT_PUBLIC_LOGTO_APP_ID}
ENV NEXT_PUBLIC_LOGTO_ENDPOINT=${NEXT_PUBLIC_LOGTO_ENDPOINT}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV LOGTO_APP_SECRET=${LOGTO_APP_SECRET}
ENV NEXT_PUBLIC_API_URL_MAIN=${NEXT_PUBLIC_API_URL_MAIN}
ENV LOGTO_COOKIE_SECRET=${LOGTO_COOKIE_SECRET}
ENV NEXT_PUBLIC_API_RESOURCE=${NEXT_PUBLIC_API_RESOURCE}

RUN \
    apk update --no-cache ;\
    apk upgrade --no-cache ;\
    apk add --no-cache bun nodejs pnpm libstdc++ ;\
    echo "NEXT_PUBLIC_LOGTO_APP_ID=$NEXT_PUBLIC_LOGTO_APP_ID" >> .env && \
    echo "LOGTO_APP_SECRET=$LOGTO_APP_SECRET" >> .env && \
    echo "NEXT_PUBLIC_LOGTO_ENDPOINT=$NEXT_PUBLIC_LOGTO_ENDPOINT" >> .env && \
    echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" >> .env && \
    echo "NEXT_PUBLIC_API_URL_MAIN=$NEXT_PUBLIC_API_URL_MAIN" >> .env && \
    echo "LOGTO_COOKIE_SECRET=$LOGTO_COOKIE_SECRET" >> .env && \
    echo "NEXT_PUBLIC_API_RESOURCE=$NEXT_PUBLIC_API_RESOURCE" >> .env
    

FROM bun_wolfi_base AS bun_wolfi_build
ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN \
    pnpm install ;\
    pnpm run build ;\
    rm -rf .env.local .env.example

COPY --from=bun_wolfi_base /app/.env ./.env

FROM bun_wolfi_base AS bun_wolfi_run

RUN \
    addgroup --system --gid 1001 nobin ;\
    adduser --system --uid 1001 nobin

WORKDIR /app
ENV NODE_ENV=production

# Propagate envs to the runtime container as well (for server-side usage)
ENV NEXT_PUBLIC_LOGTO_APP_ID=${NEXT_PUBLIC_LOGTO_APP_ID}
ENV NEXT_PUBLIC_LOGTO_ENDPOINT=${NEXT_PUBLIC_LOGTO_ENDPOINT}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV LOGTO_APP_SECRET=${LOGTO_APP_SECRET}
ENV NEXT_PUBLIC_API_URL_MAIN=${NEXT_PUBLIC_API_URL_MAIN}
ENV LOGTO_COOKIE_SECRET=${LOGTO_COOKIE_SECRET}
ENV NEXT_PUBLIC_API_RESOURCE=${NEXT_PUBLIC_API_RESOURCE}

# Copy the standalone output from the builder stage
COPY --from=bun_wolfi_build /app/.next/standalone ./
# Copy public assets and the static build
COPY --from=bun_wolfi_build /app/public ./public
COPY --from=bun_wolfi_build /app/.next/static ./.next/static

RUN chown -R nobin:nobin .
USER nobin
EXPOSE 3000

CMD [ "sh", "-c", "bun server.js" ]
