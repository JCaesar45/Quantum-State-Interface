# Quantum State Interface

Polyglot distributed web application integrating a reactive frontend with Python, Java, and TypeScript backend microservices.

## Architecture

| Component | Technology | Function |
| :--- | :--- | :--- |
| Frontend | HTML5, CSS3, ECMAScript 2022 | Reactive proxy state management and glassmorphism UI. |
| Python Service | FastAPI | Asynchronous data aggregation and I/O-bound operations. |
| Java Service | Spring Boot | CPU-bound transactional logic and data validation. |
| TypeScript Service | Node.js, Express, WebSocket | Real-time bidirectional client-server communication. |

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.9 or higher)
- Java Development Kit (JDK 17 or higher)
- Maven or Gradle

## Installation and Execution

### Frontend
The frontend is a single-file implementation. No build step is required.
```bash
# Serve the HTML file using a static file server.
python -m http.server 8000
```
Access the interface at `http://localhost:8000`.

### Python FastAPI Service
```bash
# Install dependencies
pip install fastapi uvicorn pydantic

# Run the server on port 8001
uvicorn main:app --reload --port 8001
```

### Java Spring Boot Service
```bash
# Build the project (assuming Maven)
mvn clean install

# Run the application on default port 8080
java -jar target/transaction-service-0.0.1-SNAPSHOT.jar
```

### TypeScript WebSocket Gateway
```bash
# Install dependencies
npm install express ws @types/express @types/ws typescript ts-node

# Compile and run on port 8081 to avoid collision with Java service
PORT=8081 npx ts-node server.ts
```

## API Endpoints

### Python Telemetry Service (Port 8001)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/telemetry` | Ingest telemetry payload and return aggregated metrics. |
| `GET` | `/api/v1/metrics` | Retrieve current aggregated metrics. |

**Telemetry Payload Schema:**
```json
{
  "node_id": "string",
  "throughput": "integer",
  "latency_ms": "float",
  "cache_hit_rate": "float"
}
```

### Java Transaction Service (Port 8080)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/transactions/execute` | Process a transactional request. |

**Transaction Request Schema:**
```json
{
  "accountId": "string",
  "amount": "float"
}
```

### TypeScript WebSocket Gateway (Port 8081)

**Connection:** `ws://localhost:8081`

**Client Messages:**
```json
{ "type": "ping" }
{ "type": "subscribe_metrics" }
```

**Server Messages:**
```json
{ "type": "connection_ack", "clientId": "string" }
{ "type": "pong", "timestamp": "integer" }
{ "type": "metric_update", "data": { "throughput": "integer", "latency": "float", "timestamp": "integer" } }
```

## References

Flanagan, D. (2020). *JavaScript: The definitive guide* (7th ed.). O'Reilly Media.

Richardson, C. (2018). *Microservices patterns: With examples in Java*. Manning Publications.

Robinson, M. (2021). *Python microservices development*. Packt Publishing.

Walls, C. (2015). *Spring Boot in Action*. Manning Publications.
