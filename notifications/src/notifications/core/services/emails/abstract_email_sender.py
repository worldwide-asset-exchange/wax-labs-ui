import abc
import io
import logging
import typing

Filename: typing.TypeAlias = str


class AbstractEmailSender(abc.ABC):
    def __init__(self):
        self._logger = logging.getLogger("waxlabs")

    @abc.abstractmethod
    async def send(
        self,
        subject: str,
        email_to: str | list[str],
        email_from: str,
        content: str,
        is_html: bool = True,
        attachments: list[tuple[Filename, io.StringIO]] | None = None,
    ) -> bool:
        pass
