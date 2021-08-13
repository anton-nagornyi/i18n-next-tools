# i18n-next-tools

This is a solution for scanning, keying translations and syncing them with google sheets. 

## Install:

```shell script
npm install --save i18n-next-tools
```

## Config:

You may provide `18n-next-tools.json` inside the project's root folder:
```json
{
    "available-langs": [
      "en",
      "ru",
      "ua"
    ],
    "google": {
      "privateKey": "./google-project-aa3ebb5b3177.json",
      "spreadsheetId": "2Jwl37s05XW-RgY5F-ZTuNXme33rrag22k0EwUQmBZga"
    },
    "resourcesFile": "src/i18n/resources.json"
  }
```

or you may add `i18n` section to your `package.json` file with the config above.
* `available-langs` - languages that your app is translated to.
* `google` - provide google configuration if you are planning to sync your translations with google sheets. Otherwise it may be omitted.
* `google.privateKey` - obtain service account credentials from google. It should be json file with your private key.
* `google.spreadsheetId` - id of a spread sheet to sync with.
* `resourcesFile`: - path to the file where to store scanned translations.

## Use:

Firstly use translation in your code:

```typescript
import { Translate } from "i18n-next-tools";
import express from 'express';

const t = Translate('onBoard');

const translatedText = t.k1('default text');
const anotherTranslatedText = t.k2('default text');
```

Consider calls to `k1` and `k2` functions. These are wrappers around `i18next.t` and they are also markers for the translations code scanner.
Avoid using the same `k` function for different translations. 

Now you can generate translations resource file:

```shell script
npx i18nt-create-translations
```
This will scan all your `ts` and `tsx` files and will create at resource file at the `resourcesFile` location.
If `resourcesFile` already exists it will:
1. remove unused keys from it
2. add new keys to it
3. leave translation for already existed keys untouched

If you want to sync with `google sheets` call:
```shell script
npx i18nt-sync
```
This will:
1. do everything that `npx i18nt-create-translations` does.
2. download data from google sheet, compare it with `resourcesFile`, carefully merge them and upload result back to google.

You may also wish to provide translations from your backend:

```typescript
import {i18nFromGoogleSheetExpress} from 'i18n-next-tools';

const router = express.Router();

router.get('/translations', i18nFromGoogleSheetExpress);
``` 
