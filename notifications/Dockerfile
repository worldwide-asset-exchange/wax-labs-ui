FROM python:3.12.6-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH="/app/src/" \
    DEBIAN_FRONTEND=noninteractive \
    POETRY_WARNINGS_EXPORT=false

RUN apt-get -qq update -y \
        && apt-get -qq upgrade -y \
        && apt-get clean autoclean \
        && apt-get autoremove --yes \
        && rm -rf /var/lib/{apt,dpkg,cache,log}/

COPY ./pyproject.toml ./poetry.lock ./README.md ./

RUN --mount=from=ghcr.io/astral-sh/uv,source=/uv,target=/bin/uv \
    --mount=from=ghcr.io/astral-sh/uv,source=/uvx,target=/bin/uvx \
    --mount=type=cache,target=/root/.cache/uv \
    uvx poetry export --without-hashes --with main -f requirements.txt -o requirements.txt \
    && uv pip sync --compile-bytecode --link-mode=copy --system requirements.txt \
    && rm requirements.txt

WORKDIR /app

COPY /confs/image/gunicorn_conf.py /opt/gunicorn_conf.py
COPY ./src ./src/
COPY ./alembic.ini ./

EXPOSE 8000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "/opt/gunicorn_conf.py", "notifications.main:app"]

