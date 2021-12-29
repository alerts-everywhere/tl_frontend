# Telegram Frontend for the Alerts Scrapper

This project allows the deployment of a Telegram frontend for interacting with the HF alerts scraper

## Development

Bot commands should be implemented as callback functions in the `main.js` file.
There are two types of commands:
- updates commands, declared with the `addCommand` method. These commands process a telegram message object when it is received.
For more informations about the message format, check out the [Telegram API Documentation](https://core.telegram.org/bots/api#message)
- external commands, declared with the `addExternalCommand` these commands will be exposed on your bot cloud function, on the `/external/<cmd-name` endpoint.

## Deployment

To deploy a new bot using this template, you need a GCP project.
Deployment is done automatically on every push to the master branch, using github actions.
The deployment workflow at `.github/workflows/deploy-to-gcp.uml` must be updated with the bot parameters.

## Local testing

This bot uses nodejs and the node package manager to manage dependencies.
To install required dependencies, run `npm install`

A local nodejs server can be run for local testing.
To allow the bot to post messages, the bot token must be set as an environment variable.
Furthermore, a service account is used to access the firestore database. A key for the service account
must be downloaded and its path set as an environment variable for authentication of the local server.
```
export TOKEN=<your-bot-token>
export GOOGLE_APPLICATION_CREDENTIALS=<path-to-key-file>
```

The local server can be run with the following command:
```
node local_server.js
```

**Using local requests**

You can send mocked update to the local server by sending the following `POST` request to `localhost:8080`:

```json
{
  "update_id": 1234,
  "message": {
    "message_id": 1234,
    "from": {
      "id": <your_chat_id>,
      "is_bot": false,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "language_code": "en"
    },
    "chat": {
      "id": <your_chat_id>,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "type": "private"
    },
    "date": 1234,
    "text": "/cmd message text",
    "entities": [
        {
            "length": 4,
            "offset": 0,
            "type": "bot_command"
        }
    ]
  }
}
```

The chat id field for your telegram account can be discovered using the following method: https://www.alphr.com/find-chat-id-telegram/

You may also wish to change the text and entities parameters to test out other message formats.

**Receiving real updates**

To allow the bot to receive actual updates from telegram, the local port must be exposed on
a secured endpoint over the internet. For this I recommend using [ngrok](https://ngrok.com/).
The local endpoint must then be set as a hook to the telegram API:
```
ngrok http 8080
bash set_hook.sh <ngrok-https-endpoint> <your-bot-token>
```