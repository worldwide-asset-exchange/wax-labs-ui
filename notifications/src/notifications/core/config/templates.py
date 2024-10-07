import re
from typing import Any

import css_inline
from starlette.templating import Jinja2Templates

from notifications.settings import cfg

css_inliner = css_inline.CSSInliner()


class TemplateRenderer:
    def __init__(self):
        self._assets_path = cfg.templates_dir / "assets"

        self._templates = Jinja2Templates(directory=cfg.templates_dir)
        self._templates.env.globals["FRONTEND_URL"] = cfg.frontend_host
        self._templates.env.globals["ASSETS_PATH"] = self._assets_path
        self._templates.env.globals["CSS_PATH"] = self._assets_path / "css"

    def render(self, template_name: str, context: dict[str, Any] = None, inline_css: bool = True):
        template = self._templates.get_template(template_name)
        if inline_css:
            inlined_html = css_inliner.inline(template.render(context or {}))
            return re.sub(rf'<link href="{self._assets_path}.*\.css" rel="stylesheet">', "", inlined_html)

        return template.render(context or {})


tpl_engine = TemplateRenderer()
