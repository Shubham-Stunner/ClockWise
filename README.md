# ClockWise

ClockWise is a simple time and attendance tracker with a React frontend and
Node.js/Express backend powered by MongoDB. It can be run locally using Docker
compose.

## Requirements
Before running the containers you only need **Docker** with the
**Docker Compose** plugin installed.  If you would like to run the
frontend or backend directly on your host for development, install the
following as well:

- **Node.js** (v18 or newer) and **npm**
- **MongoDB** (if not using the provided Docker service)

## Running locally

```bash
docker-compose up --build
```

The frontend will be available on `http://localhost:3000`, the backend API on
`http://localhost:5000`, and MongoDB on `mongodb://localhost:27017`.

The backend seeds a default user on first run:

- **Email:** `user@example.com`
- **Password:** `password`

Copy `backend/.env.example` to `backend/.env` to configure your own values for
the development environment if needed.

## Project Structure
```
frontend/   # React + Tailwind application
backend/    # Express API and Slack integration
k8s/        # Kubernetes deployment manifests (placeholders)
```
