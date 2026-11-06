# Malla ICINF ULagos

Interactive curriculum for Ingeniería Civil en Informática at Universidad de
Los Lagos. Students mark the courses they have passed, see what each course
requires and unlocks, and plan their next semester against the 33-credit
limit. Both curricula are included: Malla 2027 and Malla 2020 (DU416).
Everything is stored in the browser; there is no backend and no account.

## Run locally

Requires Node 26+ and pnpm 12.

```sh
pnpm install
pnpm dev
```

Production build and local preview:

```sh
pnpm build
pnpm preview
```

## Deploy

The `Dockerfile` builds the app and serves `dist/` with nginx on port 80.

```sh
docker build -t malla-icinf .
docker run --rm -p 8080:80 malla-icinf
```

On Dokploy, create an application from this repository with the Dockerfile
build type; no environment variables are needed.

## License

MIT, see `LICENSE`.
