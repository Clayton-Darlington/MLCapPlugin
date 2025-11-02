import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.nativeMLDemo',
  appName: 'Native ML Demo',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    MLPlugin: {
      modelName: "yolov8s",
      modelType: "object-detection"
    }
  }
};

export default config;
