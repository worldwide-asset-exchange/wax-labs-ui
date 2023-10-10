from fastapi import FastAPI

from .proposals import router as proposal_router


def install_routes(app: FastAPI):
    app.include_router(proposal_router)
