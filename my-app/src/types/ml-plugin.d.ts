declare module 'ml-plugin' {
  export interface EchoOptions {
    value: string;
  }

  export interface EchoResult {
    value: string;
  }

  export interface ClassifyImageOptions {
    base64Image: string;
  }

  export interface ClassificationResult {
    label: string;
    confidence: number;
  }

  export interface ClassifyImageResult {
    predictions: ClassificationResult[];
  }

  export interface GenerateTextOptions {
    prompt: string;
    modelConfig?: {
      modelUrl?: string;
      modelPath?: string;
      downloadAtRuntime?: boolean;
      maxTokens?: number;
      temperature?: number;
    };
  }

  export interface GenerateTextResult {
    generatedText?: string;
    text?: string;
    [key: string]: any;
  }

  export class MLPlugin {
    static echo(options: EchoOptions): Promise<EchoResult>;
    static classifyImage(options: ClassifyImageOptions): Promise<ClassifyImageResult>;
    static generateText(options: GenerateTextOptions): Promise<GenerateTextResult>;
  }
}