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
      modelPath: "gemma-3n-E4B-it-int4-Web.litertlm",
      huggingFaceToken: process.env['HUGGING_FACE_TOKEN'] || 'YOUR_HF_TOKEN_HERE',
      modelUrl: "https://huggingface.co/google/gemma-3n-E2B-it-litert-lm/resolve/main/model.litertlm"
    }
  },
  server: {
    // Allow access to Hugging Face API
    allowNavigation: ['https://huggingface.co/*']
  }
};

export default config;
