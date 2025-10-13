# Hello World Capacitor Plugin

A simple Hello World Capacitor plugin demonstrating cross-platform native functionality with iOS and Android implementations.

## Platform Support

- **Android**: Native Java implementation
- **iOS**: Native Swift implementation  
- **Web**: TypeScript implementation for testing

## Features

- Simple echo functionality
- Personalized greeting messages
- Cross-platform compatibility
- Type-safe TypeScript API
- Native platform logging

## Installation

```bash
npm install hello-world-capacitor-plugin
npx cap sync
```

## Usage

```typescript
import { HelloWorld } from 'hello-world-capacitor-plugin';

// Echo a message
const echoResult = await HelloWorld.echo({ value: "Hello Capacitor!" });
console.log(echoResult.value); // "Hello Capacitor!"

// Get a personalized greeting
const greeting = await HelloWorld.getGreeting({ name: "Developer" });
console.log(greeting.greeting); // "Hello Developer from iOS!" or "Hello Developer from Android!"
```

## API

### `echo(options: { value: string })`

Echoes back the provided string value.

**Parameters:**
- `options.value` (string): The string to echo back

**Returns:** `Promise<{ value: string }>`

**Example:**
```typescript
const result = await HelloWorld.echo({ value: "Test message" });
console.log(result.value); // "Test message"
```

### `getGreeting(options: { name: string })`

Returns a personalized greeting message from the native platform.

**Parameters:**
- `options.name` (string): The name to include in the greeting

**Returns:** `Promise<{ greeting: string }>`

**Example:**
```typescript
const result = await HelloWorld.getGreeting({ name: "John" });
console.log(result.greeting); // "Hello John from iOS!" (on iOS) or "Hello John from Android!" (on Android)
```

## Platform-Specific Behavior

### Android
- Uses native Android logging (Log.i)
- Returns greetings with "from Android!" suffix
- Implemented in Java

### iOS  
- Uses native iOS logging (print)
- Returns greetings with "from iOS!" suffix
- Implemented in Swift

### Web
- Uses browser console logging
- Returns greetings with "from the web!" suffix
- Implemented in TypeScript

## Demo

Open `demo.html` in a web browser to test the plugin functionality in a web environment.

## Development

### Building the Plugin

```bash
npm install
npm run build
```

### Testing

```bash
# Verify all platforms
npm run verify

# Test individual platforms
npm run verify:ios
npm run verify:android
npm run verify:web
```

## Development

### Prerequisites

- Node.js 16+
- Capacitor CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```
