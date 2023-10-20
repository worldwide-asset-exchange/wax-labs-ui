## API Deployment

## Requirement
The API requires a valid telegram bot token and username to be set on the `TELEGRAM_BOT_TOKEN` and `TELEGRAM_BOT_USERNAME` environment variables or in the `.env` file.

- To get a bot token, you need to create a bot using the [BotFather](https://t.me/botfather) bot. 
- The bot username is the username you choose for your bot.

## Deploying the API

There are two ways to deploy the API, using a Bare Metal approach or using Podman. The following sections describe how to deploy the API using each of these methods.

Using Podman is the recommended approach, as it is the one used in the development environment.

### Using Podman

### Requirements Installation
The unix platform requires the following packages to be installed:
- Podman 4.5+
- nginx 1.21+

#### 1. Upload the contents of the `notifications` folder to the server

#### 2. Execute the following command inside the notifications folder to build the image:
```bash
$ podman build -t waxlabs/notifications:latest .
```

#### 3. Create the `.env` file on /opt/wax_labs/.env. The file should be based on the `.env.example` file.

#### 4. Copy the contents of the `<root>/notifications/confs/container` file to `/etc/containers/systemd/`

#### 5. Execute the following command so Podman can generate the systemd service file:
```bash
$ systemctl daemon-reload
```

#### 6. Start the service:
```bash
$ systemctl start wax_labs_v3_app.service
```

This command will also start the PostgreSQL service.

#### 7. Check the status of the services:
```bash
$ systemctl start wax_labs_v3_app.service
$ systemctl start wax_labs_v3_pg.service
```

All the logs will be available on the systemd journal (`journalctl -u wax_labs_v3_app.service`).

#### 8. Configure nginx
Copy the contents of the `<root>/notifications/confs/nginx` file to `/etc/nginx/sites-available/wax_labs_v3_app.conf` and create a symlink to `/etc/nginx/sites-enabled/wax_labs_v3_app.conf`.

Before copying the nginx configuration file, make sure that the `server_name` directive is set to the correct domain name.

#### 9. Restart nginx
```bash
$ systemctl restart nginx
```

#### 10. Set up the SSL certificate
The SSL certificate is not included in the repository. You need to set up the SSL certificate manually.
The easiest way to do this is to use [Certbot](https://certbot.eff.org/).

### Bare Metal

### Requirements Installation
The unix platform requires the following packages to be installed:
- libpq-dev
- gcc
- Python 3.11
- PostgreSQL 14
- Poetry (latest)
- nginx 1.21+

#### 1. Upload the contents of the `notifications` folder to the server

#### 2. Create the `.env` file on the same folder of the application. The file should be based on the `.env.example` file.

#### 3. Install the dependencies
```bash
$ poetry install --no-interaction --no-ansi --without dev
```

#### 5. Set up a supervisor service
Setup a supervisor service to run the application. The following is an example of a supervisor service configuration file:
```ini
[program:wax_labs_v3_app]
command=/opt/wax_labs/notifications/.venv/bin/"gunicorn -k uvicorn.workers.UvicornWorker -c /opt/gunicorn_conf.py notifications.main:app
directory=/opt/wax_labs/notifications
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/wax_labs_v3_app.err.log
stdout_logfile=/var/log/wax_labs_v3_app.out.log
```

or use a systemd service:
```ini
[Unit]
Description=Wax Labs V3 App
After=network.target
EnvironmentFile=/opt/wax_labs/.env
ExecStart=/opt/wax_labs/notifications/.venv/bin/gunicorn -k uvicorn.workers.UvicornWorker -c /opt/gunicorn_conf.py notifications.main:app
WorkingDirectory=/opt/wax_labs/notifications
User=www-data
Group=www-data
Restart=always
```

#### 6. Set up the PostgreSQL database
Create a database and a user with the same name as the one set on the `DB_` prefixed environment variable in the .env file.

#### 7. Configure nginx
Copy the contents of the `<root>/notifications/confs/nginx` file to `/etc/nginx/sites-available/wax_labs_v3_app.conf` and create a symlink to `/etc/nginx/sites-enabled/wax_labs_v3_app.conf`.

Before copying the nginx configuration file, make sure that the `server_name` directive is set to the correct domain name.

#### 8. Restart nginx
```bash
$ systemctl restart nginx
```

#### 9. Set up the SSL certificate
The SSL certificate is not included in the repository. You need to set up the SSL certificate manually.
The easiest way to do this is to use [Certbot](https://certbot.eff.org/).


## Deploying the Database
#### Run the following command to execute the database migrations:
For Bare Metal:
```bash
$ poetry run alembic upgrade head
```

For Podman:
```bash
$ podman exec wax_labs_v3_app alembic upgrade head
```

## Initial Data Seed 
#### Run the following command to execute the initial seed:
For Bare Metal:
```bash
$ poetry run wax_labs users
$ poetry run wax_labs proposals
```

For Podman:
```bash
$ podman exec wax_labs_v3_app wax_labs users
$ podman exec wax_labs_v3_app wax_labs proposals
```

The command may take sometime to finish, as it will fetch all the proposals from the WAX blockchain.
