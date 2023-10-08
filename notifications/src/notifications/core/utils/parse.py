import hashlib
import json
import logging
import typing
from datetime import datetime
from json import JSONDecodeError
from uuid import UUID

from fastapi.encoders import jsonable_encoder
from pydantic import UUID4

logger = logging.getLogger("waxlabs")


def datetime_try_parse(iso_string: typing.Optional[str]) -> datetime | str | None:
    try:
        if isinstance(iso_string, datetime) or not isinstance(iso_string, str) or iso_string is None:
            return iso_string

        if iso_string.lower().endswith("z"):
            iso_string = iso_string[:-1]

        return datetime.fromisoformat(iso_string)
    except ValueError:
        return iso_string


def try_parse_json(json_string: str) -> dict[typing.Any, typing.Any] | None:
    try:
        if json_string:
            return typing.cast(dict[typing.Any, typing.Any], json.loads(json_string))

        return None
    except JSONDecodeError as e:
        logger.opt(exception=e).error("Parsing json")
        return None


def deep_get(obj: typing.Any | None, *keys) -> typing.Any | None:
    """
    This function will try to resolve a deep nesting without raising an
    exception. The keys can be a mix from dict keys, attributes and properties.
    """
    if not keys or obj is None:
        return obj

    current_keys: typing.List[typing.Any] = list(keys)
    key = current_keys.pop(0)

    try:
        if isinstance(obj, dict):
            return deep_get(obj.get(key, None), *current_keys)

        if isinstance(obj, (list, tuple)) and isinstance(key, int):
            return deep_get(obj[key] if len(obj) > key else None, *current_keys)

        return deep_get(getattr(obj, key, None), *current_keys)
    except Exception:
        return None


def try_parse_uuid(str_uuid: str) -> UUID4 | None:
    try:
        return typing.cast(UUID4, UUID(str_uuid))
    except ValueError:
        return None


def generate_hash_from_dict(hashable_dict: dict[str, typing.Any]) -> str:
    sorted_selected_arts = json.dumps(jsonable_encoder(hashable_dict), sort_keys=True).encode("utf8")
    return hashlib.sha512(sorted_selected_arts).hexdigest()
