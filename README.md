# MLCapPlugin

A Capacitor plugin that provides machine learning capabilities using native ML frameworks on mobile platforms.

## Platform Support

- **Android**: Google ML Kit
- **iOS**: Apple Core ML
- **Web**: Not supported

## Features

- Cross-platform ML inference
- Native performance on mobile devices
- Easy integration with Capacitor apps
- Type-safe TypeScript API

## Installation

```bash
npm install mlcap-plugin
npx cap sync
```

## Usage

```typescript
import { MLCapPlugin } from 'mlcap-plugin';

// Example usage
const result = await MLCapPlugin.predict({
  modelPath: 'path/to/your/model',
  inputData: yourInputData
});

console.log('Prediction result:', result);
```

## API

### `predict(options: PredictOptions)`

Runs inference on the provided input data using the specified model.

**Parameters:**

- `options` (PredictOptions): Configuration object containing:
  - `modelPath` (string): Path to the ML model file
  - `inputData` (any): Input data for the model

**Returns:** `Promise<PredictResult>`

**Example:**

```typescript
const options = {
  modelPath: 'assets/models/my-model.tflite', // Android: .tflite, iOS: .mlmodel
  inputData: {
    // Your input data structure
  }
};

const result = await MLCapPlugin.predict(options);
```

## Platform-Specific Setup

### Android

1. Ensure your model is in TensorFlow Lite format (`.tflite`)
2. Place model files in `android/app/src/main/assets/`
3. ML Kit dependencies are automatically included

### iOS

1. Ensure your model is in Core ML format (`.mlmodel`)
2. Add model files to your iOS project bundle
3. Core ML framework is automatically linked

## Model Formats

| Platform | Supported Format | Extension |
|----------|------------------|-----------|
| Android  | TensorFlow Lite  | `.tflite` |
| iOS      | Core ML          | `.mlmodel` |

## Error Handling

The plugin provides detailed error messages for common issues:

- Model file not found
- Invalid input data format
- Platform-specific ML framework errors

```typescript
try {
  const result = await MLCapPlugin.predict(options);
} catch (error) {
  console.error('ML prediction failed:', error.message);
}
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
