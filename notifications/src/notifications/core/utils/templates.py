import typing

from starlette.templating import Jinja2Templates

if typing.TYPE_CHECKING:
    import jinja2


class TemplateEngine(Jinja2Templates):
    def render(self, name, **kwargs) -> str:
        tpl = self.get_template(name)

        return tpl.render(**kwargs)

    def render_telegram(self, name, **kwargs) -> str:
        return self.render(name, **kwargs).replace("<br>", "\n")

    def get_template(self, name: str) -> "jinja2.Template":
        if not name.endswith(".jinja2"):
            name = f"{name}.html.jinja2"

        return super().get_template(name)
