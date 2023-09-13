import typing

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import ORJSONResponse
from loguru import logger
from pydantic import ValidationError
from starlette import status
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.requests import Request


def get_preflight_headers(request: Request) -> typing.Dict[typing.Any, typing.Any]:
    try:
        return request.app.middleware_stack.app.preflight_headers or dict()
    except AttributeError:
        return dict()


def setup_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> ORJSONResponse:
        logger.opt(exception=exc).error("HTTP exception handler")

        return ORJSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
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

    app.exception_handler(Exception)(generic_error_handler)
