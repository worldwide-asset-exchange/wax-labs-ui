from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from lagom import Container, Singleton

from notifications.core.repository import IDatabase
from notifications.core.repository.database import Database
from notifications.core.utils.templates import TemplateEngine
from notifications.interfaces.proposal_service import IProposalService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.interfaces.user_service import IUserService
from notifications.services.listener import NotificationHandler
from notifications.services.proposal import ProposalService
from notifications.services.subscription import SubscriptionService
from notifications.services.users import UserService
from notifications.settings import cfg

container = Container()

container[IDatabase] = Singleton(Database)
container[IUserService] = Singleton(UserService)
container[ISubscriptionService] = Singleton(SubscriptionService)
container[IProposalService] = Singleton(ProposalService)
container[TemplateEngine] = Singleton(lambda: TemplateEngine(directory=cfg.templates_directory))
container[NotificationHandler] = Singleton(NotificationHandler)
container[Bot] = Singleton(lambda: Bot(cfg.telegram_bot_token, default=DefaultBotProperties(parse_mode="HTML")))
container[Dispatcher] = Singleton(lambda: Dispatcher())
