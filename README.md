# Prettier plugin classify imports

A prettier plugin to classify import declarations by provided Regular Expression order.
Forked from prettier-plugin-sort-imports
To enhance some features.
- Sort by the string length of the import statement
- Add a default classification for Type Files(<TYPES_DECLARATIONS>), excluding <THIRD_PARTY_MODULES>.
- Set `importOrderSeparation` and `importOrderSortSpecifiers` and their default value to true.

### Input

```typescript
import type { FC } from 'react'
import React, {
    useEffect,
    useRef,
    ChangeEvent,
    KeyboardEvent,
} from 'react';
import { logger } from '@core/logger';
import { reduce, debounce } from 'lodash';
import { Message } from '../Message';
import { createServer } from '@server/node';
import { Alert } from '@ui/Alert';
import { repeat, filter, add } from './utils';
import { initializeApp } from '@core/app';
import { Popup } from '@ui/Popup';
import { createConnection } from '@server/database';
```

### Output
```typescript
import type { FC } from 'react';

import { Alert } from '@ui/Alert';
import { Popup } from '@ui/Popup';
import { logger } from '@core/logger';
import { reduce, debounce } from 'lodash';
import { initializeApp } from '@core/app';
import { createServer } from '@server/node';
import { createConnection } from '@server/database';
import React, { useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';

import { Message } from '../Message';
import { add, repeat, filter } from './utils';

```

### Install
`npm install prettier-plugin-classify-imports --save-dev`

or 

`yarn add prettier-plugin-classify-imports --dev`

**Note: If formatting `.vue` sfc files please install `@vue/compiler-sfc` if not in your dependency tree - this normally is within Vue projects.**

### Usage

Add an order in prettier config file.

```ecmascript 6
module.exports = {
  "plugins": ["prettier-plugin-classify-imports"]
  "importOrder": ["^[./]|(@\/)"]
}
```

### APIs
[orgin document](https://github.com/trivago/prettier-plugin-sort-imports/blob/v5/README.md)
### Disclaimer

This plugin modifies the AST which is against the rules of prettier.
