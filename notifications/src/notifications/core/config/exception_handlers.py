import logging
import typing

from asyncpg import PostgresError
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import ORJSONResponse
from pydantic import ValidationError
from sqlalchemy.exc import DatabaseError, IntegrityError, NoResultFound
from starlette import status
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.requests import Request

from notifications.core.exceptions.unique import CONSTRAINT_HANDLERS
from notifications.core.schemas.common import ErrorModel
from notifications.core.utils.parse import deep_get

logger = logging.getLogger("waxlabs")


def get_preflight_headers(request: Request) -> dict[str, typing.Any]:
    try:
        return request.app.middleware_stack.app.preflight_headers or dict()
    except AttributeError:
        return dict()


def get_integrity_violation_detail(exception: IntegrityError) -> list[dict[str, typing.Any]]:
    original_exc = deep_get(exception, "orig")

    constraint_name = deep_get(original_exc, "__cause__", "constraint_name") or deep_get(
        original_exc, "__context__", "constraint_name"
    )
    for exception_handler, fn in CONSTRAINT_HANDLERS.items():
        if constraint_name in exception_handler.integrity_key:
            exception_raised = fn()  # type: ignore[no-untyped-call]
            return typing.cast(list[dict[str, typing.Any]], exception_raised.errors())

    return []


def setup_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(IntegrityError)
    async def integrity_exception_handler(request: Request, exc: IntegrityError) -> ORJSONResponse:
        logger.opt(exception=exc).error("Integrity exception handler")

        detail = get_integrity_violation_detail(exc)

        return ORJSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": detail},
            headers=get_preflight_headers(request),
        )

    @app.exception_handler(NoResultFound)
    async def no_result_found_exception_handler(request: Request, exc: NoResultFound) -> ORJSONResponse:
        logger.opt(exception=exc).error('Not handled "No record found"')

        return ORJSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content=ErrorModel.create("No record found").dict(),
            headers=get_preflight_headers(request),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> ORJSONResponse:
        logger.opt(exception=exc).error("HTTP exception handler")

        return ORJSONResponse(
            status_code=exc.status_code,
            content=ErrorModel.create(exc.detail).dict(),
            headers={
                **get_preflight_headers(request),
                **(exc.headers or {}),
            },
        )

    async def validation_exception_handler(request: Request, exc: ValidationError) -> ORJSONResponse:
        logger.opt(exception=exc).error("Validation exception handler")

        errors = exc.errors()

        for err in errors:
            if len(err["loc"]) > 0:
                erro_loc: list[str | int] = list(err["loc"])
                loc: int | str = erro_loc[-1]

                while not isinstance(loc, str):
                    loc = erro_loc.pop(-1)

                location = loc.replace("_", " ")
                err["msg"] = err["msg"].replace("this value", f"the {location}")

        return ORJSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": errors,
                "body": jsonable_encoder(getattr(exc, "body", None)),
            },
            headers=get_preflight_headers(request),
        )

    app.exception_handler(RequestValidationError)(validation_exception_handler)
    app.exception_handler(ValidationError)(validation_exception_handler)

    async def generic_error_handler(request: Request, exc: Exception) -> ORJSONResponse:
        logger.opt(exception=exc).error("Generic error handler")

        return ORJSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            headers=get_preflight_headers(request),
            content="Bad request",
        )

    app.exception_handler(PostgresError)(generic_error_handler)
    app.exception_handler(DatabaseError)(generic_error_handler)
    app.exception_handler(Exception)(generic_error_handler)
