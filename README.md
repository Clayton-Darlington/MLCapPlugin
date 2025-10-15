# ML Image Classification Plugin

A Capacitor plugin for real-time image classification using MobileNetV2 and CoreML on iOS devices. This plugin enables mobile apps to classify images captured from the camera or selected from the photo gallery using on-device machine learning.

**Demo App**: Includes a modern Ionic Angular application showcasing all plugin functionality.

## Quick Start

Want to see it in action? Run the demo app:

```bash
git clone https://github.com/Clayton-Darlington/MLCapPlugin.git
cd MLCapPlugin/my-app
npm install
ng build
npx cap sync ios
npx cap run ios
```

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

- Node.js 18+ (recommended)
- npm or yarn package manager
- Ionic CLI (`npm install -g @ionic/cli`)
- Capacitor CLI (`npm install -g @capacitor/cli`)
- Angular CLI (`npm install -g @angular/cli`)
- Xcode 15+ (for iOS development)
- iOS device or simulator (iOS 14+)

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

The included Ionic Angular demo app showcases all plugin functionality including image classification, text generation, and camera integration.

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Clayton-Darlington/MLCapPlugin.git
   cd MLCapPlugin
   ```

2. **Navigate to the demo app:**
   ```bash
   cd my-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the Angular app:**
   ```bash
   ng build
   # or alternatively: npm run build
   ```

5. **Sync with Capacitor (adds native platforms and plugins):**
   ```bash
   npx cap sync ios
   ```

6. **Open in Xcode and run:**
   ```bash
   npx cap open ios
   ```
   Then build and run from Xcode, or use:
   ```bash
   npx cap run ios
   ```

### Development Workflow

For active development with live reload:

1. **Start the development server:**
   ```bash
   ng serve
   # or: npm start
   ```

2. **In a separate terminal, run on device with live reload:**
   ```bash
   npx cap run ios --livereload --external
   ```

### Configuration

The app is configured in `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.example.nativeMLDemo',
  appName: 'Native ML Demo',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    MLPlugin: {
      modelPath: "gemma-3n-E4B-it-int4-Web.litertlm",
      huggingFaceToken: process.env['HUGGING_FACE_TOKEN'] || 'YOUR_HF_TOKEN_HERE',
      modelUrl: "https://huggingface.co/google/gemma-3n-E2B-it-litert-lm/resolve/main/model.litertlm"
    }
  }
};
```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint
- `npx cap sync` - Sync web assets and plugins
- `npx cap run ios` - Build and run on iOS

## Development

### Demo App Architecture

The demo app is built with:
- **Ionic 8** with Angular 20 LTS
- **Capacitor 7** for native functionality
- **TypeScript** for type safety
- **Standalone Components** (Angular 20+ feature)
- **Modern Angular patterns** (inject(), control flow syntax)

### Building from Source

If you want to modify the plugin itself:

```bash
# In the root directory (if plugin source exists)
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

1. **Build Errors**:
   ```bash
   # Clear Angular cache
   ng cache clean
   
   # Clean and reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   
   # Rebuild and sync
   ng build
   npx cap sync ios
   ```

2. **iOS Build Failures**:
   - Ensure Xcode 15+ is installed
   - Update iOS deployment target to 14.0+
   - Clean Xcode build folder (Product → Clean Build Folder)
   - Verify Podfile.lock is up to date: `cd ios/App && pod install`

3. **Plugin Not Found**:
   ```bash
   # Verify plugin is listed in package.json dependencies
   # Ensure capacitor.config.ts includes MLPlugin configuration
   npx cap sync ios
   ```

4. **Camera Permissions**:
   - The plugin automatically requests camera permissions
   - Check iOS Settings → Privacy & Security → Camera if issues persist

5. **Model Loading Issues**:
   - Ensure model files are in `ios/App/App/` directory
   - Check file sizes (models are large files)
   - Verify Hugging Face token is configured for text generation

6. **Live Reload Issues**:
   ```bash
   # Use external live reload for device testing
   npx cap run ios --livereload --external --host=0.0.0.0
   ```

### Debug Mode

- **Xcode Console**: View detailed logs in Xcode console
- **Browser DevTools**: Use Safari Web Inspector for web debugging
- **Ionic DevApp**: Use `ionic serve` for web testing before device deployment

### Performance Tips

- Models are loaded on first use (may take time initially)
- Image classification is faster with lower resolution images
- Text generation requires significant device resources

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
