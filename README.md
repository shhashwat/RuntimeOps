# RuntimeOps

RuntimeOps is a full-stack deployment operations dashboard built with
Next.js, NestJS, PostgreSQL, Redis, and BullMQ.

<hr/>

## Features

- Authentication & Authorization
- Project Management
- Deployment Monitoring
- Activity Tracking
- Operational Dashboard
- User Profile Management
- Queue-Based Deployment Processing

<hr/>

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React Query

### Backend

- NestJS
- PostgreSQL
- Prisma
- JWT Authentication

### Infrastructure

- Docker
- Redis
- BullMQ

<hr/>

## Architecture

![System Architecture - Basic](/docs/RuntimeOps%20Basic%20System%20Design.png)

![System Architecture - Full](/docs/Runtime%20ops%20system%20design.png)

<hr/>

## Database Design

![Database Deisgn](/docs/RuntimeOps%20DB%20Design.png)

<hr/>

## Screenshots

### Landing Page - Login & Register Page

![login-page](/docs/screenshots/landing-page.login.png)
![register-page](/docs/screenshots/landing-page.register.png)

### Dashboard - Desktop and Mobile view

![dashboard](/docs/screenshots/dashboard.png)

![mobile-dashboard](/docs/screenshots/mobile-dashboard.png)

### Projects - Project page and details page

![projects](/docs/screenshots/projects.png)

![project-details](/docs/screenshots/projects-details.png)

### Deployments

![deployments](/docs/screenshots/deployment-details.png)

### Activities

![activities](/docs/screenshots/activities.png)

![mobile-activities](/docs/screenshots/mobile-activities.png)

### User Profile Page

![profile-page](/docs/screenshots/profile.png)

<hr/>

# Setup

### Prerequisites

- Node.js 22+
- Docker
- Docker Compose

### Clone Repository

```bash
git clone <repository-url>
cd RuntimeOps
```

### Start Infrastructure & Applications

```bash
docker compose up --build
```

then at folder level:

```bash
cd api && npm i
cd ..
cd web && npm i
```

This will start:

- Frontend (Next.js)
- Backend API (NestJS)
- PostgreSQL
- Redis
- BullMQ Worker

### Seed Database

After containers are running, seed the database:

```bash
cd api
npx tsx prisma/seed.ts
```

<hr/>

## Access Application

- Frontend: http://localhost:3000

- Backend API: http://localhost:3001

- Swagger API Documentation: http://localhost:3001/api/docs

---

## API Documentation

RuntimeOps includes Swagger/OpenAPI documentation for all backend endpoints.

Swagger UI:

```text
http://localhost:3001/api/docs
```

### Swagger Preview

![swagger-docs](/api/swagger-docs.png)

---

## Project Structure

```text
runtime_ops
├── api/                 # NestJS backend
├── web/                 # Next.js frontend
├── docs/                # Documentation & screenshots
├── docker-compose.yml
└── README.md
```

---

## Architecture Notes

RuntimeOps follows a service-oriented architecture:

1. Users interact with the Next.js dashboard.
2. Frontend communicates with the NestJS API.
3. API persists data in PostgreSQL.
4. Deployment requests are pushed to BullMQ queues.
5. Background workers process deployments asynchronously.
6. Deployment status, logs, and activities are stored and exposed through API endpoints.

<hr/>

## Assumptions

- Deployments are simulated using BullMQ background workers.
- Repository cloning, container provisioning, and health checks are mocked to demonstrate deployment lifecycle behavior.
- The application is designed as a single-tenant dashboard for demonstration purposes.
- Docker and Docker Compose are available on the host machine.
- PostgreSQL and Redis are managed through Docker Compose.

<hr/>

## Limitations

- No GitHub webhook integration.
- No real container builds or deployments.
- No WebSocket-based real-time updates (polling is used instead).
- No cloud provider integration.
- No CI/CD pipeline integration.
- Role-based authorization is modeled but not fully enforced.
- Deployment logs are simulated rather than streamed from actual infrastructure.
