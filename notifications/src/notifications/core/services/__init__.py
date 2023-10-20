import aioboto3
from botocore.config import Config


class AwsAuth:
    def __init__(self, service: str):
        from notifications.settings import cfg

        self._service = service

        attr_service = service.replace("-", "_")
        self._region = getattr(cfg, f"{attr_service}_aws_region", None) or cfg.aws_region
        self._profile = getattr(cfg, f"{attr_service}_aws_profile", None) or cfg.aws_profile
        self._access_key = getattr(cfg, f"{attr_service}_aws_access_key", None) or cfg.aws_access_key
        self._secret_key = getattr(cfg, f"{attr_service}_aws_secret_key", None) or cfg.aws_secret_key

        if self._profile is not None:
            self._base = aioboto3.Session(
                profile_name=self._profile,
                region_name=self._region,
            )
        elif self._secret_key is not None and self._access_key is not None:
            self._base = aioboto3.Session(
                aws_access_key_id=self._access_key,
                aws_secret_access_key=self._secret_key,
                region_name=self._region,
            )
        else:
            self._base = aioboto3.Session(
                region_name=self._region,
            )

    @property
    def client(self):
        return self._base.client(self._service, region_name=self._region)

    @property
    def s3_client(self):
        return self._base.client(
            self._service,
            region_name=self._region,
            config=Config(signature_version="s3v4"),
        )

    @property
    def resource(self):
        return self._base.resource(self._service, region_name=self._region)
