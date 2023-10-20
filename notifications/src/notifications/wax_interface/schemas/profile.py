from pydantic import field_validator

from notifications.core.schemas.base import BaseSchema


class Profile(BaseSchema):
    wax_account: str
    full_name: str
    country: str
    bio: str
    image_url: str | None = None
    website: str | None = None
    contact: str
    group_name: str

    @field_validator("contact", mode="before")
    @classmethod
    def validate_contact(cls, value: str) -> str:
        if not value:
            return value

        if value.startswith("@"):
            return value.replace("@", "")

        return value
