# NotifyMeTTV (notify-me-ttv)

Get notified when someone in your list has started livestream on Twitch

![how to](/howTo_v2.jpg)

- With [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&hl=fr&gl=US) (based on
  chromium), you can download this extension and get notifications.
  ![mobile notification](/mobile_notification.jpg)

## Setup env

- Create new file: `src/dev-consts.js`

```js
export const DEV_TWITCH_CLIENT_ID = '{YOUR_TWITCH_CLIENT_ID_HERE}' // https://dev.twitch.tv/console/apps
export const DEV_TWITCH_REDIRECT_URL = 'https://{YOUR_EXTENSION_ID_HERE}.chromiumapp.org/'
```

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
