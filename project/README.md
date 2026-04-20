# Task Manager — MERN + Redis + Docker

A minimal full-stack Task Manager built with **MongoDB, Express, React, Node.js**, backed by **Redis** for caching, and fully containerized with **Docker Compose**.

---

## Overview

A simple CRUD app to manage tasks (add, list, toggle complete, delete). It demonstrates:

- A MERN stack wired together through Docker Compose
- Redis caching of the `GET /tasks` response
- Cache invalidation on every write (create / update / delete)
- Clean service separation and inter-container networking via service names

---

## Architecture

```
 ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
 │   Frontend   │  HTTP  │   Backend    │  TCP   │   MongoDB    │
 │   React :3000│ ─────► │  Express:5000│ ─────► │     :27017   │
 └──────────────┘        └──────┬───────┘        └──────────────┘
                                │
                                │ cache
                                ▼
                         ┌──────────────┐
                         │  Redis :6379 │
                         └──────────────┘
```

Each service runs in its own container. They communicate on a shared Docker network (`taskmanager-net`) using service names (`mongo`, `redis`, `backend`) — **never `localhost`** inside containers.

### Services

| Service   | Image / Build     | Port  | Purpose                         |
|-----------|-------------------|-------|---------------------------------|
| frontend  | `node:20-alpine`  | 3000  | React UI                        |
| backend   | `node:20-alpine`  | 5000  | Express REST API                |
| mongo     | `mongo:7`         | 27017 | Primary data store              |
| redis     | `redis:7-alpine`  | 6379  | Cache for `GET /tasks`          |

A named volume `mongo-data` persists MongoDB data across restarts.

---

## How Redis Caching Works

1. **Read path** — `GET /tasks`
   - Backend checks Redis for key `tasks:all`.
   - **Hit:** returns the cached JSON immediately (`source: "cache"`).
   - **Miss:** queries MongoDB, stores the result in Redis with a **60-second TTL** (`SETEX`), and returns it (`source: "db"`).

2. **Write path** — `POST` / `PUT` / `DELETE`
   - Backend performs the DB mutation.
   - Deletes the `tasks:all` key (`DEL`), so the next read rebuilds the cache with fresh data.

This gives you both fast reads and guaranteed freshness after any write. The `source` field in the response makes it easy to see in the UI whether the data came from cache or DB.

---

## Project Structure

```
docker-doc/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── tasks.js
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env
└── README.md
```

---

## How to Run

Requires **Docker Desktop** (or Docker + Docker Compose v2).

```bash
docker-compose up --build
```

Then open:

- **Frontend UI:** http://localhost:3000
- **Backend API:** http://localhost:5000/tasks
- **Health check:** http://localhost:5000/health

To stop and remove containers:

```bash
docker-compose down
```

To also remove the MongoDB volume:

```bash
docker-compose down -v
```

---

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint       | Description                   | Cache Behavior        |
|--------|----------------|-------------------------------|-----------------------|
| GET    | `/tasks`       | List all tasks                | Served from cache (60s TTL) |
| POST   | `/tasks`       | Create a task `{ "title" }`   | Invalidates cache     |
| PUT    | `/tasks/:id`   | Update a task                 | Invalidates cache     |
| DELETE | `/tasks/:id`   | Delete a task                 | Invalidates cache     |
| GET    | `/health`      | Health probe                  | —                     |

### Example requests

```bash
# List tasks
curl http://localhost:5000/tasks

# Create a task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'

# Toggle completion
curl -X PUT http://localhost:5000/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:5000/tasks/<id>
```

---

## Environment Variables

Defined in `.env` and passed to the containers via `docker-compose.yml`:

| Variable            | Description                                | Default                                 |
|---------------------|--------------------------------------------|-----------------------------------------|
| `PORT`              | Backend port                               | `5000`                                  |
| `MONGO_URI`         | MongoDB connection string                  | `mongodb://mongo:27017/taskmanager`     |
| `REDIS_HOST`        | Redis hostname (Docker service name)       | `redis`                                 |
| `REDIS_PORT`        | Redis port                                 | `6379`                                  |
| `REACT_APP_API_URL` | Backend URL used by the frontend           | `http://localhost:5000`                 |

---

## Task Model

```js
{
  title: String,        // required
  completed: Boolean,   // default false
  createdAt: Date,      // auto
  updatedAt: Date       // auto
}
```

---

## Notes

- No authentication — this is intentionally kept simple.
- `depends_on` ensures backend starts after `mongo` and `redis`, and retries on failure.
- Production hardening (NGINX reverse proxy, production React build, health checks, secrets management) is left as an exercise.
