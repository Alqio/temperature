## Set up

### Native
Create .env that sets `DB_HOST=0.0.0.0` and `DB_PORT=6007`.

Fill also other values as indicated in ../.env.

### Docker
Create .env.docker that sets `DB_HOST=db`, `DB_PORT=5432`, `SSL_PRIVATE_KEY` and `SSL_CERTIFICATE`.

Fill also other values as indicated in ../.env.

When starting with `docker-compose.yml`, `CERT_FOLDER` env variable must be set.