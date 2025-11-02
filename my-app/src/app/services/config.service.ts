import { Injectable } from '@angular/core';
import { CapacitorConfig } from '@capacitor/cli';

declare const Capacitor: any;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor() {
    // Access the Capacitor configuration
    this.config = (window as any)?.Capacitor?.config || {};
  }

  getMLPluginConfig() {
    return this.config.plugins?.MLPlugin || {};
  }

  getModelName(): string {
    return this.getMLPluginConfig().modelName || 'yolov8s';
  }

  getModelType(): string {
    return this.getMLPluginConfig().modelType || 'object-detection';
  }
}