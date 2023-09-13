import enum
from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings

env_file = Path(__file__).parent / "../../.env"


class Settings(BaseSettings):
    debug: bool = True
    enable_gzip: bool = False

    # App
    app_name: str = "Wax Labs Notifications"
    app_version: str = "1.0.0"
    app_env: str = "testnet"
    app_description: str = ""
    app_docs_url: str = "/docs"

    # Redis
    redis_host: str = "redis"
    redis_port: int = 6379
    redis_db: int = 0
    redis_namespace: str = "testnet"

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # It will be the origins that will enable the CORS support for the browser
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000"]'
    backend_cors_origins: list[AnyHttpUrl] | list[Literal["*"]] | None = ["*"]

    # BACKEND_TRUSTED_ORIGINS is a JSON-formatted list of origins without schema
    # This should be the final URL for the App
    # e.g: '["localhost", "api.com"]'
    backend_trusted_origins: list[str] = ["*"]

    telegram_bot_username: str
    telegram_bot_token: str

    wax_labs_url: AnyHttpUrl = "https://waxlabs-v3.detroitledger.tech"
    wax_labs_proposal_base_url: str = f"{wax_labs_url}/proposals/"

    wax_chain_url: AnyHttpUrl = "https://test.wax.eosusa.io/"
    wax_labs_contract_account: str

    class Config:
        env_file = env_file
        env_file_encoding = "utf-8"


cfg = Settings()


class Tables(enum.Enum):
    ACCOUNTS = "accounts"
    PROPOSAL_COMMENTS = "pcomments"
    DELIVERABLES_COMMENTS = "dcomments"
    CONFIG = "config"
    MD_BODIES = "mdbodies"
    DELIVERABLES = "deliverables"
    PROFILES = "profiles"
    PROPOSALS = "proposals"
    VOTERS = "voters"
    BALLOTS = "ballots"
