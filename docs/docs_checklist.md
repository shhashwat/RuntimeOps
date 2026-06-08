# RuntimeOps — Documentation Checklist

# Required Documentation

## 1. README.md

Main project overview.

Must include:

* project purpose
* architecture overview
* setup instructions
* environment variables
* Docker setup
* migration commands
* API docs route
* demo credentials
* assumptions
* limitations

---

## 2. architecture.md

Include:

* system design diagram
* deployment lifecycle
* backend architecture
* frontend architecture
* queue flow
* polling strategy

---

## 3. database-design.md

Include:

* ERD diagram
* table descriptions
* enum descriptions
* indexing strategy
* relation explanations

---

## 4. api-contracts.md

Include:

* endpoint list
* request bodies
* response shapes
* auth requirements
* status codes

Swagger will complement this.

---

## 5. deployment-flow.md

Include:

* deployment lifecycle
* queue processing flow
* log generation flow
* activity timeline flow

---

## 6. setup-guide.md

Include:

* Docker setup
* local development steps
* Prisma migration commands
* troubleshooting steps

---

## 7. demo-script.md

For recording final demo video.

Include:

* login flow
* create project
* trigger deployment
* view logs
* view dashboard
* view activity timeline

---

# Optional Documentation

## 8. tradeoffs.md

Include:

* why polling instead of WebSockets
* why simulated deployments
* why Docker Compose
* why Prisma
* timeline-based decisions

---

## 9. future-improvements.md

Include:

* WebSocket support
* rollback deployments
* real CI/CD integration
* Kubernetes support
* metrics charts
* notifications

---

# Swagger Requirement

Swagger MUST be implemented tomorrow.

Target route:

```txt
/api/docs
```

Swagger should document:

* auth endpoints
* projects endpoints
* deployment endpoints
* health endpoints
* DTO schemas
* auth guards
