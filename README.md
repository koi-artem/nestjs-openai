## Prerequisites

### ngrok
Must install ngrok for webhook connection
You must be registered and authenticated, so you can have static URL
```bash
brew install ngrok/ngrok/ngrok
ngrok config add-authtoken <token>
```

Environment variables
```
OPENAI_API_KEY
TELEGRAM_BOT_TOKEN=<get this from @BotFather>
TELEGRAM_BOT_DOMAIN=<ngrok personal public URL>
TELEGRAM_BOT_PATH=/bot
CONTACT_TELEGRAM=<Owner's telegram>
CONTACT_INSTAGRAM=<Owner's instagram>

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=boilerplateuser
POSTGRES_PASSWORD=boilerplatepassword
POSTGRES_DATABASE=boilerplatedb
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ docker-compose up -d
$ npm run migration:generate
$ npm run migration:run
$ npm run start

# watch mode
$ npm run start:ngrok
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
