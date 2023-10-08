import io
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from botocore.exceptions import ClientError

from notifications.core.services import AwsAuth
from notifications.core.services.emails.abstract_email_sender import AbstractEmailSender, Filename
from notifications.settings import cfg


class SesEmailSender(AbstractEmailSender):
    def __init__(self):
        super().__init__()

        self._bucket = cfg.aws_bucket
        self._base = AwsAuth("ses")

    @property
    def client(self):
        return self._base.client

    async def send(
        self,
        subject: str,
        email_to: str | list[str],
        email_from: str,
        content: str,
        is_html: bool = True,
        attachments: list[tuple[Filename, io.StringIO]] | None = None,
    ) -> bool:
        try:
            email_to = email_to if isinstance(email_to, list) else [email_to]

            message = MIMEMultipart()
            message["Subject"] = subject
            message["From"] = email_from
            message["To"] = ", ".join(email_to)

            if is_html:
                part = MIMEText(content, "html", "utf-8")
                message.attach(part)
            else:
                part = MIMEText(content, "plain", "utf-8")
                message.attach(part)

            attachments: list[tuple[Filename, io.StringIO]] = attachments or []

            for file_name, attachment_body in attachments:
                part = MIMEApplication(attachment_body.read().encode("utf8"))
                part.add_header("Content-Disposition", "attachment", filename=file_name)
                message.attach(part)

            # Provide the contents of the email.
            async with self.client as ses:
                response = await ses.send_raw_email(
                    Source=email_from,
                    Destinations=email_to,
                    RawMessage={
                        "Data": message.as_string(),
                    },
                )

            self._logger.bind(**response).info("Email sent")

        except ClientError as e:
            self._logger.opt(exception=e).error("Error sending email")

            return False
        else:
            return True
