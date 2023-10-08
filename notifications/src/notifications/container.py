from lagom import Container, Singleton

from notifications.core.repository import IDatabase
from notifications.core.repository.database import Database
from notifications.interfaces.proposal_service import IProposalService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.interfaces.user_service import IUserService
from notifications.services.proposal import ProposalService
from notifications.services.subscription import SubscriptionService
from notifications.services.users import UserService

container = Container()

container[IDatabase] = Singleton(Database)
container[IUserService] = Singleton(UserService)
container[ISubscriptionService] = Singleton(SubscriptionService)
container[IProposalService] = Singleton(ProposalService)
