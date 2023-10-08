from notifications.core.services.base_service import BaseService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.models.proposals import Subscription
from notifications.schemas.subscription import SubscriptionExport


class SubscriptionService(ISubscriptionService, BaseService[Subscription, SubscriptionExport]):
    table = Subscription
    table_export = SubscriptionExport
