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

  getHuggingFaceToken(): string {
    return this.getMLPluginConfig().huggingFaceToken || '';
  }

  getModelUrl(): string {
    return this.getMLPluginConfig().modelUrl || '';
  }

  getModelPath(): string {
    return this.getMLPluginConfig().modelPath || '';
  }

  // Create authenticated headers for Hugging Face API
  getAuthHeaders(): Record<string, string> {
    const token = this.getHuggingFaceToken();
    if (token && token !== 'YOUR_HF_TOKEN_HERE') {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {};
  }
}