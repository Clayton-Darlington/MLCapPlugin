import { registerPlugin } from '@capacitor/core';

import type { HelloWorldPlugin } from './definitions';

const HelloWorld = registerPlugin<HelloWorldPlugin>('HelloWorld', {
  web: () => import('./web').then(m => new m.HelloWorldWeb()),
});

export * from './definitions';
export { HelloWorld };