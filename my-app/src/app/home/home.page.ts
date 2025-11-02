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
  IonImg,
  IonItem,
  IonList,
  IonLabel,
  AlertController,
  LoadingController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SplashScreen } from '@capacitor/splash-screen';
import { ConfigService } from '../services/config.service';
import { MLPlugin } from 'ml-plugin';

interface DetectionResult {
  label: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Extended plugin interface with detectObjects method
interface ExtendedMLPlugin {
  detectObjects(options: { base64Image: string }): Promise<{ detections: DetectionResult[] }>;
  classifyImage(options: { base64Image: string }): Promise<{ predictions: DetectionResult[] }>;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonButton, 
    IonImg,
    IonItem,
    IonList,
    IonLabel
  ],
})
export class HomePage implements OnInit {
  detectionResults: DetectionResult[] = [];
  imagePreview: string = '';
  showDetectionResults: boolean = false;
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
      
      const alert = await this.alertController.create({
        header: 'Success',
        message: `✅ Connection successful!\nEcho response: ${JSON.stringify(result, null, 2)}`,
        buttons: ['OK']
      });
      await alert.present();
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Connection failed: ' + error.message);
    }
  }

  async takePhotoAndDetect() {
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
      await this.detectObjects(photo, 'camera');
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Camera error: ' + error.message);
    }
  }

  async selectFromGalleryAndDetect() {
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
      await this.detectObjects(photo, 'gallery');
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Gallery error: ' + error.message);
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

  clearResults() {
    this.detectionResults = [];
    this.imagePreview = '';
    this.showDetectionResults = false;
    this.showImagePreview = false;
  }

  private async detectObjects(photo: any, source: string) {
    const loading = await this.loadingController.create({
      message: 'Detecting objects with YOLOv8s...'
    });
    await loading.present();

    try {
      const base64Data = this.extractBase64Data(photo);
      if (!base64Data) {
        await loading.dismiss();
        this.showError('No base64 data found in photo object');
        return;
      }

      // Set image preview
      this.imagePreview = base64Data;
      this.showImagePreview = true;

      // Cast to extended plugin type to access detectObjects
      const extendedPlugin = MLPlugin as unknown as ExtendedMLPlugin;
      const result = await extendedPlugin.detectObjects({ 
        base64Image: base64Data
      });
      
      await loading.dismiss();
      
      // Parse object detection results
      if (result && result.detections && result.detections.length > 0) {
        this.detectionResults = result.detections;
        this.showDetectionResults = true;
      } else {
        this.showError('No objects detected in the image');
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Object detection failed: ' + error.message);
    }
  }

  private async classifyImage(photo: any, source: string) {
    const loading = await this.loadingController.create({
      message: 'Classifying image with YOLOv8s...'
    });
    await loading.present();

    try {
      const base64Data = this.extractBase64Data(photo);
      if (!base64Data) {
        await loading.dismiss();
        this.showError('No base64 data found in photo object');
        return;
      }

      // Set image preview
      this.imagePreview = base64Data;
      this.showImagePreview = true;

      const result = await MLPlugin.classifyImage({ 
        base64Image: base64Data
      } as any);
      
      await loading.dismiss();
      
      // Parse classification results
      if (result && result.predictions && result.predictions.length > 0) {
        this.detectionResults = result.predictions;
        this.showDetectionResults = true;
      } else {
        this.showError('No objects classified in the image');
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Image classification failed: ' + error.message);
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
