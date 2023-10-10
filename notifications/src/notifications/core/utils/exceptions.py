import typing

from fastapi import HTTPException
from pydantic import ValidationError
from pydantic_core import InitErrorDetails
from starlette import status

from notifications.core.exceptions import Error


def create_validation_error(validation_exception: Error, value: typing.Any | None = None) -> ValidationError:
    return ValidationError.from_exception_data(
        title=str(validation_exception),
        line_errors=[
            InitErrorDetails(
                type=validation_exception.code,
                loc=tuple(validation_exception.location),
                input=value,
                ctx=validation_exception.ctx,
            )
        ],
    )


def create_unprocessed_error(message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=message,
    )
