import { Component, OnInit, inject } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton, 
  IonTextarea, 
  IonImg,
  IonItem,
  AlertController,
  LoadingController 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SplashScreen } from '@capacitor/splash-screen';
import { ConfigService } from '../services/config.service';
// Import the plugin dynamically to avoid build issues
declare var MLPlugin: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonButton, 
    IonTextarea, 
    IonImg,
    IonItem,
    FormsModule
  ],
})
export class HomePage implements OnInit {
  textPrompt: string = '';
  classificationResults: string = '';
  textResults: string = '';
  imagePreview: string = '';
  showClassificationResults: boolean = false;
  showTextResults: boolean = false;
  showImagePreview: boolean = false;

  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private configService = inject(ConfigService);

  constructor() {}

  async ngOnInit() {
    await SplashScreen.hide();
  }

  async testEcho() {
    const loading = await this.loadingController.create({
      message: 'Testing plugin connection...'
    });
    await loading.present();

    try {
      const result = await MLPlugin.echo({ value: 'Hello MLPlugin!' });
      await loading.dismiss();
      
      this.classificationResults = `✅ Connection successful!\nEcho response: ${JSON.stringify(result, null, 2)}`;
      this.showClassificationResults = true;
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Connection failed: ' + error.message);
    }
  }

  async takePhotoAndClassify() {
    const loading = await this.loadingController.create({
      message: 'Opening camera...'
    });
    await loading.present();

    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        quality: 90,
        allowEditing: false,
        source: CameraSource.Camera
      });

      await loading.dismiss();
      await this.classifyImage(photo, 'camera');
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Camera error: ' + error.message);
    }
  }

  async selectFromGalleryAndClassify() {
    const loading = await this.loadingController.create({
      message: 'Opening photo gallery...'
    });
    await loading.present();

    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        quality: 90,
        allowEditing: false,
        source: CameraSource.Photos
      });

      await loading.dismiss();
      await this.classifyImage(photo, 'gallery');
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Gallery error: ' + error.message);
    }
  }

  async takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        quality: 90
      });

      if (photo.webPath) {
        this.imagePreview = photo.webPath;
        this.showImagePreview = true;
      }
    } catch (error: any) {
      console.warn('Photo cancelled or failed:', error);
    }
  }

  async generateText() {
    if (!this.textPrompt.trim()) {
      this.showError('Please enter a prompt');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Downloading model and generating text...'
    });
    await loading.present();

    try {
      // Get configuration from Capacitor config
      const modelUrl = this.configService.getModelUrl();
      const authHeaders = this.configService.getAuthHeaders();
      const huggingFaceToken = this.configService.getHuggingFaceToken();
      
      // Check if token is configured
      if (!huggingFaceToken || huggingFaceToken === 'YOUR_HF_TOKEN_HERE') {
        await loading.dismiss();
        this.showError('Hugging Face token not configured. Please set HUGGING_FACE_TOKEN in your environment or update capacitor.config.ts');
        return;
      }

      const result = await MLPlugin.generateText({ 
        prompt: this.textPrompt, 
        modelConfig: {
          modelUrl: modelUrl,
          downloadAtRuntime: true,
          maxTokens: 512,
          temperature: 0.7,
          authHeaders: authHeaders,
          huggingFaceToken: huggingFaceToken
        }
      });

      await loading.dismiss();
      
      let displayText = '✅ Text generation completed:\n\n';
      if (result && result.generatedText) {
        displayText += `Generated text:\n${result.generatedText}`;
      } else if (result && result.text) {
        displayText += `Generated text:\n${result.text}`;
      } else {
        displayText += `Full response:\n${JSON.stringify(result, null, 2)}`;
      }

      this.textResults = displayText;
      this.showTextResults = true;
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Text generation failed: ' + error.message);
    }
  }

  clearText() {
    this.textPrompt = '';
    this.textResults = '';
    this.showTextResults = false;
  }

  private async classifyImage(photo: any, source: string) {
    const loading = await this.loadingController.create({
      message: 'Classifying image...'
    });
    await loading.present();

    try {
      const base64Data = this.extractBase64Data(photo);
      if (!base64Data) {
        await loading.dismiss();
        this.showError('No base64 data found in photo object');
        return;
      }

      const result = await MLPlugin.classifyImage({ base64Image: base64Data });
      await loading.dismiss();
      
      let displayText = `✅ Photo captured successfully from ${source}\n`;
      displayText += `✓ Photo data extracted successfully\n`;
      displayText += `🎯 Classification Results:\n`;
      displayText += JSON.stringify(result, null, 2);

      this.classificationResults = displayText;
      this.showClassificationResults = true;
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Classification failed: ' + error.message);
    }
  }

  private extractBase64Data(photo: any): string | null {
    if (photo.base64String) {
      return `data:image/jpeg;base64,${photo.base64String}`;
    } else if (photo.dataUrl) {
      return photo.dataUrl;
    }
    return null;
  }

  private async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
