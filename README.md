## Prerequisites

### ffmpeg

```
brew install ffmpeg
```
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
AIRTABLE_API_KEY=<https://airtable.com/create/tokens>
AIRTABLE_BASE=<https://airtable.com/developers/web/api/introduction>
CONTACT_TELEGRAM=<Owner's telegram>
CONTACT_INSTAGRAM=<Owner's instagram>
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
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
