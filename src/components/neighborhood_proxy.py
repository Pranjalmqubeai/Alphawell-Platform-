# app/neighborhood_proxy.py
import requests
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/neighborhood", tags=["neighborhood"])

@router.get("/wells")
def get_wells(url: str = Query(...)):
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return JSONResponse(content=r.json())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch wells.json: {e}")

@router.get("/production-metrics")
def get_prod_metrics(url: str = Query(...)):
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return JSONResponse(content=r.json())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch prod metrics: {e}")
