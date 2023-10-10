from lagom.integrations.fast_api import FastApiIntegration

from notifications.container import container

deps = FastApiIntegration(container)
