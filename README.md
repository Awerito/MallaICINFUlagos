# Malla ICINF ULagos

Interactive curriculum for Ingeniería Civil en Informática at Universidad de
Los Lagos. Students mark the courses they have passed, see what each course
requires and unlocks, and plan their next semester against the 33-credit
limit. Both curricula are included: Malla 2027 and Malla 2020 (DU416).
Everything is stored in the browser; there is no backend and no account.

## Run locally

Requires Node 26+ and pnpm 12.

```sh
cp sample.env .env
pnpm install
pnpm dev
```

Production build and local preview:

```sh
pnpm build
pnpm preview
```

## Deploy

The `Dockerfile` builds the app and serves `dist/` with nginx on port 80. The
public URL used in the Open Graph tags comes from the `VITE_SITE_URL` build
argument, which is required (`.env` covers local builds only):

```sh
docker build --build-arg VITE_SITE_URL=https://mallaicinf.grye.org -t malla-icinf .
docker run --rm -p 8080:80 malla-icinf
```

On Dokploy, create an application from this repository with the Dockerfile
build type and set `VITE_SITE_URL` as a build argument.

## License

MIT, see `LICENSE`.
