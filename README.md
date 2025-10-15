# ML Image Classification Plugin

A Capacitor plugin for real-time image classification using MobileNetV2 and CoreML on iOS devices. This plugin enables mobile apps to classify images captured from the camera or selected from the photo gallery using on-device machine learning.

**Demo App**: Includes a modern Ionic Angular application showcasing all plugin functionality.

## Platform Support

- **iOS**: Native Swift implementation with CoreML and Vision framework
- **Android**: Stub implementation (future development)
- **Web**: Mock implementation for testing

## Features

- 🔄 Echo functionality for testing plugin connectivity
- 📸 Real-time image classification using MobileNetV2
- 📷 Camera integration for live photo classification
- 🖼️ Photo gallery selection and classification
- 🧠 On-device ML processing (no data sent to external servers)
- ⚡ Fast inference using CoreML optimization
- 🎯 Confidence scores for classification results

## Installation & Setup

> **Note**: This plugin is currently in development and not available on npm. You need to clone the repository and link it locally.

### Prerequisites

- Node.js 16+
- Capacitor CLI (`npm install -g @capacitor/cli`)
- Xcode (for iOS development)
- iOS device or simulator

### Setup Instructions

1. **Clone the ML Plugin repository:**
   ```bash
   git clone https://github.com/Clayton-Darlington/MLPlugin.git
   cd MLPlugin
   ```

2. **Install dependencies and build the plugin:**
   ```bash
   npm install
   npm run build
   ```

3. **Link the plugin locally:**
   ```bash
   npm link
   ```

4. **In your Capacitor project, link the plugin:**
   ```bash
   cd /path/to/your/capacitor/project
   npm link ml-plugin
   ```

5. **Install required Capacitor plugins:**
   ```bash
   npm install @capacitor/camera @capacitor/splash-screen
   ```

6. **Sync with Capacitor:**
   ```bash
   npx cap sync
   ```

7. **Add the plugin to your app:**
   ```typescript
   import { MLPlugin } from 'ml-plugin';
   import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
   ```

## Usage

### Basic Plugin Test

```typescript
// Test plugin connectivity
const result = await MLPlugin.echo({ value: 'Hello MLPlugin!' });
console.log(result.value); // "Hello MLPlugin!"
```

### Image Classification from Camera

```typescript
// Take photo and classify
const photo = await Camera.getPhoto({
  resultType: CameraResultType.Base64,
  source: CameraSource.Camera,
  quality: 90
});

const result = await MLPlugin.classifyImage({
  base64Image: `data:image/jpeg;base64,${photo.base64String}`
});

console.log(result.predictions);
// [
//   { label: "golden retriever", confidence: 0.95 },
//   { label: "dog", confidence: 0.87 },
//   ...
// ]
```

### Image Classification from Gallery

```typescript
// Select from gallery and classify
const photo = await Camera.getPhoto({
  resultType: CameraResultType.Base64,
  source: CameraSource.Photos,
  quality: 90
});

const result = await MLPlugin.classifyImage({
  base64Image: `data:image/jpeg;base64,${photo.base64String}`
});
```

## API Reference

### `echo(options: { value: string })`

Test plugin connectivity by echoing back a string value.

**Parameters:**
- `options.value` (string): The string to echo back

**Returns:** `Promise<{ value: string }>`

### `classifyImage(options: ClassifyImageOptions)`

Classify an image using the MobileNetV2 model.

**Parameters:**
- `options.base64Image` (string): Base64 encoded image data with data URI prefix

**Returns:** `Promise<ClassifyImageResult>`

**Types:**
```typescript
interface ClassifyImageOptions {
  base64Image: string; // "data:image/jpeg;base64,/9j/4AAQ..."
}

interface ClassifyImageResult {
  predictions: ClassificationResult[];
}

interface ClassificationResult {
  label: string;      // Predicted class name
  confidence: number; // Confidence score (0-1)
}
```

## Running the Demo App

The included Ionic demo app showcases all plugin functionality:

1. **Navigate to the demo app:**
   ```bash
   cd my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the app:**
   ```bash
   npm run build
   ```

4. **Sync with Capacitor:**
   ```bash
   npx cap sync
   ```

5. **Run on iOS:**
   ```bash
   npx cap run ios
   ```

## Development

### Building the Plugin

```bash
npm install
npm run build
```

### Project Structure

```
MLPlugin/
├── src/                    # TypeScript source
├── ios/                    # iOS native implementation
├── android/               # Android stub implementation
├── dist/                  # Built plugin files
└── my-app/               # Demo Ionic/Angular app
    ├── src/              # Angular source code
    ├── ios/              # iOS platform files
    └── www/              # Built web assets
```

### iOS Implementation Details

- Uses **CoreML** for efficient on-device inference
- Integrates **Vision framework** for image preprocessing
- Includes **MobileNetV2.mlmodel** for classification
- Optimized for iOS 13+ devices

## Troubleshooting

### Common Issues

1. **Plugin not found**: Ensure you've run `npm link` in both the plugin and your app directories
2. **iOS build errors**: Make sure Xcode is updated and you've run `npx cap sync`
3. **Permission errors**: The plugin handles camera permissions automatically
4. **Classification errors**: Ensure images are in supported formats (JPEG/PNG)

### Debug Mode

Enable detailed logging by checking the console output in Xcode when running on iOS devices.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on iOS devices
5. Submit a pull request

## Roadmap

- [ ] Android implementation with TensorFlow Lite
- [ ] Additional ML models (object detection, face recognition)
- [ ] Custom model loading
- [ ] Batch image processing
- [ ] Performance optimizations
