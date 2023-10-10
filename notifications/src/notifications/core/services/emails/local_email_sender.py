import io
import re

from notifications.core.services.emails.abstract_email_sender import AbstractEmailSender, Filename
from notifications.settings import cfg


class LocalEmailSender(AbstractEmailSender):
    async def send(
        self,
        subject: str,
        email_to: str | list[str],
        email_from: str,
        content: str,
        is_html: bool = True,
        attachments: list[tuple[Filename, io.StringIO]] | None = None,
    ) -> bool:
        self._logger.info(f"Sending email to {email_to} from {email_from}")
        self._logger.info(f"Subject: {subject}")
        self._logger.info(f"Email content is HTML? {is_html}")

        file_name = re.sub(r"\s", "_", subject).lower()
        if is_html:
            file_name += ".html"
        else:
            file_name += ".txt"

        tmp_email_upload_path = cfg.upload_path / "tmp" / "emails"
        if not tmp_email_upload_path.exists():
            tmp_email_upload_path.mkdir(parents=True, exist_ok=True)

        final_path = tmp_email_upload_path / file_name

        with open(final_path, "w") as fp:
            fp.write(content)

        self._logger.info(f"Content written to {final_path}")

        return True
