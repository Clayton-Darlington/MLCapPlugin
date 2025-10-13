import { WebPlugin } from '@capacitor/core';

import type { HelloWorldPlugin } from './definitions';

export class HelloWorldWeb extends WebPlugin implements HelloWorldPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO from web:', options);
    return options;
  }

  async getGreeting(options: { name: string }): Promise<{ greeting: string }> {
    const greeting = `Hello ${options.name} from the web!`;
    console.log('Greeting from web:', greeting);
    return { greeting };
  }
}