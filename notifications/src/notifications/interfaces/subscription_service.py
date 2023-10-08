import abc

from notifications.core.services.base_service import BaseService
from notifications.models.proposals import Subscription
from notifications.schemas.subscription import SubscriptionExport


class ISubscriptionService(BaseService[Subscription, SubscriptionExport]):
    pass
