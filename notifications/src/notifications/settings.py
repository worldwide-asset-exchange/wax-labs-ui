import enum
import logging
from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class LogLevelEnum(enum.IntEnum):
    CRITICAL = logging.CRITICAL
    FATAL = logging.FATAL
    ERROR = logging.ERROR
    WARNING = logging.WARNING
    WARN = logging.WARN
    INFO = logging.INFO
    DEBUG = logging.DEBUG
    NOTSET = logging.NOTSET


env_file = Path(__file__).parent / "../../.env"


class Settings(BaseSettings):
    debug: bool = True
    testing: bool = False
    enable_gzip: bool = False

    templates_directory: Path = Path(__file__).parent / "./templates"

    # App
    app_name: str = "Wax Labs Notifications"
    app_version: str = "1.0.0"
    app_env: str = "testnet"
    app_description: str = ""
    app_docs_url: str = "/docs"

    log_level: LogLevelEnum = LogLevelEnum.DEBUG

    # Auth
    auth_secret: SecretStr | None = None
    auth_algorithm: str = "HS256"
    token_audience: str = "notifications:auth"
    auth_token_lifetime_minutes: int = 1440  # 24 * 60
    auth_refresh_token_lifetime_minutes: int = 43200  # 24 * 60 * 30

    # Database
    db_driver_name: str = "postgresql+asyncpg"
    db_host: str
    db_name: str
    db_user: str
    db_password: SecretStr
    db_port: int | None = 5432

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # It will be the origins that will enable the CORS support for the browser
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000"]'
    backend_cors_origins: list[AnyHttpUrl] | list[Literal["*"]] | None = ["*"]

    # BACKEND_TRUSTED_ORIGINS is a JSON-formatted list of origins without schema
    # This should be the final URL for the App
    # e.g: '["localhost", "api.com"]'
    backend_trusted_origins: list[str] = ["*"]

    ## AWS SES
    ses_aws_region: str | None = "us-east-1"
    ses_aws_access_key: str | None = None
    ses_aws_secret_key: str | None = None

    telegram_bot_path: str = "waxlabs"
    telegram_bot_token: str | None = None
    telegram_bot_username: str | None = None
    telegram_bot_webhook: str | None = None

    wax_labs_url: AnyHttpUrl = "https://waxlabs-v3.detroitledger.tech"
    wax_labs_proposal_base_url: str = f"{wax_labs_url}/proposals/"

    wax_chain_url: AnyHttpUrl = "https://test.wax.eosusa.io/"
    wax_labs_contract_account: str

    model_config = SettingsConfigDict(extra="ignore", env_file=env_file)

    @classmethod
    @field_validator("log_level", mode="before")
    def assemble_log_level(cls, v: str) -> int | LogLevelEnum:
        if isinstance(v, LogLevelEnum):
            return v
        else:
            log_level = logging.getLevelName(v.upper())
            if isinstance(log_level, int):
                return log_level

        return LogLevelEnum.INFO


cfg = Settings()


class Tables(enum.StrEnum):
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

    def __str__(self):
        return self.value
