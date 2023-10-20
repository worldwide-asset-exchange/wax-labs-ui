import typing

from pydantic import Field

from notifications.core.exceptions import Error
from notifications.core.utils.exceptions import create_validation_error


class IntegrityValueError(Error):
    integrity_key: list[str] = Field(default_factory=list)


class UserNameUniqueError(IntegrityValueError):
    @classmethod
    def new(cls):
        return cls(
            code="unique",
            location=["username"],
            msg_template="This username is already taken",
            integrity_key=["ix_users_username", "users_unique_username_idx"],
        )


def create_username_unique_error(value: typing.Any | None = None):
    return create_validation_error(validation_exception=UserNameUniqueError.new(), value=value)


CONSTRAINT_HANDLERS = {
    UserNameUniqueError: create_username_unique_error,
}
