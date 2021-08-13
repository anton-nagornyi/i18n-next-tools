# i18n-next-tools

This is a solution for managing i18n-next translations. 

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
    "source": "./src",
    "resourcesFile": "src/i18n/resources.json"
  }
```

or you may add `i18n` section to your `package.json` file with the config above.
* `available-langs` - languages that your app is translated to.
* `source` - path where to search for the source files with translations.
* `resourcesFile` - path to the file where to store scanned translations.

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
