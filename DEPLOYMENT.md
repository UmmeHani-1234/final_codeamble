Deployment guide (Docker + docker-compose)

This repository includes Dockerfiles for the backend and frontend and a `docker-compose.yml` to run a full stack locally or on a VM.

Quick start (local VM) — builds images and runs services:

```bash
# from repo root
docker compose build --pull
docker compose up -d
```

Services:
- frontend: served by Nginx on port 80
- backend: Node/Express on port 5000
- mongo: MongoDB on port 27017 (data persisted to a Docker volume)

Environment variables
- Copy `backend/.env.example` to `backend/.env` and set values (JWT_SECRET, MONGODB_URI, TWILIO_*, SMTP_* if used).
- `docker-compose.yml` sets `MONGODB_URI` for the backend to use the internal MongoDB service when running via docker-compose. If you want to use Atlas, override `MONGODB_URI` in `backend/.env`.

Production notes
- Use a dedicated production database (MongoDB Atlas or managed service).
- Set strong `JWT_SECRET` and secure other secrets (do not commit `.env`).
- Consider running behind a reverse proxy (nginx) with TLS/HTTPS and a process manager or container orchestrator (Docker Swarm, Kubernetes).
- Add monitoring and logging (PM2 logs, centralized logging, Sentry).
- For high throughput SMS/email, use background workers and retry queues.

CI/CD
- Recommend creating a GitHub Actions workflow to build and publish Docker images, and a deployment step to your hosting platform (Droplet, ECS, AKS, etc.).

If you want, I can:
- Add a GitHub Actions workflow to build & push images.
- Configure TLS (Let's Encrypt) and an nginx reverse proxy.
- Create a systemd unit file or Docker Swarm stack for production.
