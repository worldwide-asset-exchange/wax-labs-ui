FROM python:3.11.6-slim-bullseye AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PATH="/opt/setup/.venv/bin:$PATH" \
    PYTHONPATH="/app/src/" \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get -qq update -y \
        && apt-get -qq upgrade -y \
        && apt-get -yqq install libpq-dev gcc \
        && pip install --quiet --upgrade pip wheel setuptools

FROM base AS build-env

ENV PATH="/root/.local/bin:$PATH" \
    POETRY_CACHE_DIR="/tmp" \
    POETRY_VIRTUALENVS_IN_PROJECT="true"

WORKDIR /opt/setup

RUN pip install poetry --quiet
COPY ./pyproject.toml ./poetry.lock ./README.md ./

COPY ./src/ ./src/
RUN poetry install --no-interaction --no-ansi --without dev

FROM base AS final

WORKDIR /app

COPY --from=build-env /opt/setup/.venv/ /opt/setup/.venv/
COPY /confs/image/gunicorn_conf.py /opt/gunicorn_conf.py
COPY ./src/ ./src/
COPY ./alembic.ini ./

EXPOSE 8006

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "/opt/gunicorn_conf.py", "notifications.main:app"]

