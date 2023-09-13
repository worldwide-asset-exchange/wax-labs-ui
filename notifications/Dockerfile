FROM python:3.11.0-slim-bullseye AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=1 \
    PYTHONOPTIMIZE="TRUE" \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PATH="/opt/setup/.venv/bin:$PATH" \
    PYTHONPATH="/app/" \
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
COPY ./pyproject.toml ./poetry.lock ./

RUN poetry install --no-interaction --no-ansi --only main

FROM base AS final

WORKDIR /app

COPY --from=build-env /opt/setup/.venv/ /opt/setup/.venv/
COPY ./src/notifications/ /app/notifications/

EXPOSE 8006


