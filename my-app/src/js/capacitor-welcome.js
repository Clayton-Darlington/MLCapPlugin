import { SplashScreen } from '@capacitor/splash-screen';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MLPlugin } from 'ml-plugin';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: block;
        width: 100%;
        height: 100%;
        background: #f8f9fa;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .header {
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 20px;
        border-radius: 12px;
        margin-bottom: 30px;
      }
      
      .header h1 {
        margin: 0;
        font-size: 2em;
        font-weight: 600;
      }
      
      .header p {
        margin: 10px 0 0 0;
        opacity: 0.9;
        font-size: 1.1em;
      }
      
      .section {
        background: white;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .section h2 {
        margin: 0 0 20px 0;
        color: #333;
        font-size: 1.3em;
      }
      
      .button-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 20px;
      }
      
      .button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      
      .button:active {
        transform: translateY(0);
      }
      
      .results {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
        display: none;
      }
      
      .results h3 {
        margin: 0 0 15px 0;
        color: #495057;
        font-size: 1.1em;
      }
      
      .results pre {
        margin: 0;
        white-space: pre-wrap;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 13px;
        line-height: 1.5;
        color: #495057;
      }
      
      .image-preview {
        max-width: 100%;
        border-radius: 8px;
        margin-top: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .text-input {
        width: 100%;
        min-height: 100px;
        padding: 12px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        resize: vertical;
        margin-bottom: 15px;
      }
      
      .text-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
      }
    </style>
    <div class="container">
      <div class="header">
        <h1>ML Plugin Demo</h1>
        <p>Powered by Gemma-3n-E4B, CoreML, and Text Generation</p>
      </div>
      
      <div class="section">
        <h2>Image Classification</h2>
        <p>Test the ML Plugin with images from camera or gallery:</p>
        <div class="button-group">
          <button class="button" id="test-echo">Test Connection</button>
          <button class="button" id="take-photo-classify">Take Photo & Classify</button>
          <button class="button" id="gallery-classify">Choose from Gallery & Classify</button>
        </div>
        <div id="results" class="results">
          <h3>Results:</h3>
          <pre id="results-text"></pre>
        </div>
      </div>
      
      <div class="section">
        <h2>Text Generation</h2>
        <p>Generate text using the ML Plugin:</p>
        <textarea id="text-input" class="text-input" placeholder="Enter your prompt here..."></textarea>
        <div class="button-group">
          <button class="button" id="generate-text">Generate Text</button>
          <button class="button" id="clear-text">Clear</button>
        </div>
        <div id="text-results" class="results">
          <h3>Generated Text:</h3>
          <pre id="text-results-text"></pre>
        </div>
      </div>
      
      <div class="section">
        <h2>Camera Preview</h2>
        <p>Take a photo to see it here:</p>
        <button class="button" id="take-photo">Take Photo</button>
        <img id="image-preview" class="image-preview" style="display: none;">
      </div>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;
      
      // Get DOM elements
      const resultsDiv = () => self.shadowRoot.querySelector('#results');
      const resultsText = () => self.shadowRoot.querySelector('#results-text');
      const imagePreview = () => self.shadowRoot.querySelector('#image-preview');

      // Helper functions
      function clearResults() {
        const results = resultsText();
        if (results) {
          results.textContent = '';
        }
      }

      function showResults() {
        const div = resultsDiv();
        if (div) {
          div.style.display = 'block';
        }
      }

      function displayResult(message, isError = false) {
        const results = resultsText();
        showResults();
        
        if (results) {
          results.style.color = isError ? '#dc3545' : '#495057';
          results.textContent += (results.textContent ? '\n\n' : '') + message;
        }
      }

      function extractBase64Data(photo) {
        if (photo.base64String) {
          return `data:image/jpeg;base64,${photo.base64String}`;
        } else if (photo.dataUrl) {
          return photo.dataUrl;
        }
        return null;
      }

      async function classifyImage(photo, source = 'camera') {
        console.log(`${source} photo object:`, photo);
        displayResult(`Photo properties: ${Object.keys(photo).join(', ')}`);
        
        const base64Data = extractBase64Data(photo);
        if (!base64Data) {
          displayResult('Error: No base64 data found in photo object', true);
          return;
        }

        displayResult('✓ Photo data extracted successfully');
        displayResult('🔄 Sending to ML model for classification...');
        
        const result = await MLPlugin.classifyImage({ base64Image: base64Data });
        displayResult('🎯 Classification Results:');
        displayResult(JSON.stringify(result, null, 2));
      }

      // Text generation helper functions
      function clearTextResults() {
        const results = self.shadowRoot.querySelector('#text-results-text');
        if (results) {
          results.textContent = '';
        }
      }

      function showTextResults() {
        const div = self.shadowRoot.querySelector('#text-results');
        if (div) {
          div.style.display = 'block';
        }
      }

      function displayTextResult(message, isError = false) {
        const results = self.shadowRoot.querySelector('#text-results-text');
        showTextResults();
        
        if (results) {
          results.style.color = isError ? '#dc3545' : '#495057';
          results.textContent += (results.textContent ? '\n\n' : '') + message;
        }
      }

      async function generateText(prompt) {
        console.log('Generating text for prompt:', prompt);
        displayTextResult('🔄 Generating text...');
        
        try {
          const result = await MLPlugin.generateText({ prompt: prompt, modelConfig: {
            downloadAtRuntime: true, // Use bundled model
          } });
          displayTextResult('✅ Text generation completed:');
          displayTextResult(JSON.stringify(result, null, 2));
        } catch (error) {
          displayTextResult('❌ Text generation failed: ' + error.message, true);
          console.error('Text generation error:', error);
        }
      }

      // Event Listeners
      self.shadowRoot.querySelector('#test-echo').addEventListener('click', async () => {
        try {
          clearResults();
          displayResult('🔌 Testing plugin connection...');
          
          const result = await MLPlugin.echo({ value: 'Hello MLPlugin!' });
          displayResult('✅ Connection successful!');
          displayResult('Echo response: ' + JSON.stringify(result, null, 2));
        } catch (error) {
          displayResult('❌ Connection failed: ' + error.message, true);
        }
      });

      self.shadowRoot.querySelector('#take-photo-classify').addEventListener('click', async () => {
        try {
          clearResults();
          displayResult('📷 Opening camera...');
          
          const photo = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            quality: 90,
            allowEditing: false,
            source: CameraSource.Camera
          });
          
          displayResult('✅ Photo captured successfully');
          await classifyImage(photo, 'camera');
          
        } catch (error) {
          displayResult('❌ Camera error: ' + error.message, true);
          console.error('Camera error:', error);
        }
      });

      self.shadowRoot.querySelector('#gallery-classify').addEventListener('click', async () => {
        try {
          clearResults();
          displayResult('🖼️ Opening photo gallery...');
          
          const photo = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            quality: 90,
            allowEditing: false,
            source: CameraSource.Photos
          });
          
          displayResult('✅ Photo selected successfully');
          await classifyImage(photo, 'gallery');
          
        } catch (error) {
          displayResult('❌ Gallery error: ' + error.message, true);
          console.error('Gallery error:', error);
        }
      });

      // Text generation event listeners
      self.shadowRoot.querySelector('#generate-text').addEventListener('click', async () => {
        try {
          const textInput = self.shadowRoot.querySelector('#text-input');
          const prompt = textInput.value.trim();
          
          if (!prompt) {
            displayTextResult('❌ Please enter a prompt', true);
            return;
          }
          
          clearTextResults();
          await generateText(prompt);
          
        } catch (error) {
          displayTextResult('❌ Text generation error: ' + error.message, true);
          console.error('Text generation error:', error);
        }
      });

      self.shadowRoot.querySelector('#clear-text').addEventListener('click', () => {
        const textInput = self.shadowRoot.querySelector('#text-input');
        const textResults = self.shadowRoot.querySelector('#text-results');
        
        if (textInput) {
          textInput.value = '';
        }
        if (textResults) {
          textResults.style.display = 'none';
        }
        clearTextResults();
      });

      self.shadowRoot.querySelector('#take-photo').addEventListener('click', async () => {
        try {
          const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            quality: 90
          });

          const image = imagePreview();
          if (image && photo.webPath) {
            image.src = photo.webPath;
            image.style.display = 'block';
          }
        } catch (error) {
          console.warn('Photo cancelled or failed:', error);
        }
      });
    }
  },
);


