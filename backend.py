from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
import random
from typing import List

app = FastAPI(title="Telemetry Aggregation Service")

class TelemetryPayload(BaseModel):
    node_id: str
    throughput: int
    latency_ms: float
    cache_hit_rate: float

class AggregatedMetrics(BaseModel):
    total_throughput: int
    avg_latency: float
    avg_cache_hit: float
    active_nodes: int

# In-memory store for demonstration; production requires Redis or similar
metrics_store: List[TelemetryPayload] = []

@app.post("/api/v1/telemetry", response_model=AggregatedMetrics)
async def ingest_telemetry(payload: TelemetryPayload):
    metrics_store.append(payload)
    if len(metrics_store) > 1000:
        metrics_store.pop(0)
    
    return await calculate_aggregates()

@app.get("/api/v1/metrics", response_model=AggregatedMetrics)
async def get_metrics():
    if not metrics_store:
        raise HTTPException(status_code=404, detail="No telemetry data available")
    return await calculate_aggregates()

async def calculate_aggregates() -> AggregatedMetrics:
    # Simulate async I/O bound aggregation
    await asyncio.sleep(0.01) 
    total_throughput = sum(m.throughput for m in metrics_store)
    avg_latency = sum(m.latency_ms for m in metrics_store) / len(metrics_store)
    avg_cache_hit = sum(m.cache_hit_rate for m in metrics_store) / len(metrics_store)
    
    return AggregatedMetrics(
        total_throughput=total_throughput,
        avg_latency=round(avg_latency, 2),
        avg_cache_hit=round(avg_cache_hit, 2),
        active_nodes=len(metrics_store)
    )
