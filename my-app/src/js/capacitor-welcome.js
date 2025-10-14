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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>Capacitor</h1>
      </capacitor-welcome-titlebar>
      <main>
        <p>
          Capacitor makes it easy to build powerful apps for the app stores, mobile web (Progressive Web Apps), and desktop, all
          with a single code base.
        </p>
        <h2>Getting Started</h2>
        <p>
          You'll probably need a UI framework to build a full-featured app. Might we recommend
          <a target="_blank" href="http://ionicframework.com/">Ionic</a>?
        </p>
        <p>
          Visit <a href="https://capacitorjs.com">capacitorjs.com</a> for information
          on using native features, building plugins, and more.
        </p>
        <a href="https://capacitorjs.com" target="_blank" class="button">Read more</a>
        <h2>ML Plugin Demo</h2>
        <p>
          Test the ML Plugin functionality:
        </p>
        <p>
          <button class="button" id="test-echo">Test Echo</button>
          <button class="button" id="test-classification">Take Photo & Classify</button>
          <button class="button" id="test-gallery-classification">Choose from Gallery & Classify</button>
        </p>
        <div id="ml-results" style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px; display: none;">
          <h3>ML Plugin Results:</h3>
          <pre id="results-text" style="white-space: pre-wrap; font-family: monospace; color: #333;"></pre>
        </div>
        <h2>Camera Demo</h2>
        <p>
          This demo shows how to call Capacitor plugins. Say cheese!
        </p>
        <p>
          <button class="button" id="take-photo">Take Photo</button>
        </p>
        <p>
          <img id="image" style="max-width: 100%">
        </p>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;

      // Helper function to display results in UI
      function displayResult(message, isError = false) {
        const resultsDiv = self.shadowRoot.querySelector('#ml-results');
        const resultsText = self.shadowRoot.querySelector('#results-text');
        
        if (resultsDiv && resultsText) {
          resultsDiv.style.display = 'block';
          resultsText.style.color = isError ? '#d32f2f' : '#333';
          resultsText.textContent += (resultsText.textContent ? '\n\n' : '') + message;
        }
      }

      // Test Echo button
      self.shadowRoot.querySelector('#test-echo').addEventListener('click', async function (e) {
        try {
          displayResult('Testing Echo function...');
          const result = await MLPlugin.echo({ value: 'Hello MLPlugin!' });
          displayResult('Echo result: ' + JSON.stringify(result, null, 2));
        } catch (error) {
          displayResult('Echo error: ' + error.message, true);
        }
      });

      // Test Image Classification button
      self.shadowRoot.querySelector('#test-classification').addEventListener('click', async function (e) {
        try {
          displayResult('Testing Image Classification...');
          // First try to take a photo, then classify it
          const photo = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            quality: 90,
            allowEditing: false,
            source: CameraSource.Camera
          });
          
          // Debug: Log all photo properties
          console.log('Photo object:', photo);
          displayResult(`Photo taken successfully. Available properties: ${Object.keys(photo).join(', ')}`);
          displayResult(`Base64 length: ${photo.base64String ? photo.base64String.length : 'undefined'}`);
          displayResult(`DataUrl length: ${photo.dataUrl ? photo.dataUrl.length : 'undefined'}`);
          
          let base64Data = null;
          
          // Try to get base64 data from different properties
          if (photo.base64String) {
            base64Data = `data:image/jpeg;base64,${photo.base64String}`;
            displayResult('Using base64String property');
          } else if (photo.dataUrl) {
            base64Data = photo.dataUrl;
            displayResult('Using dataUrl property');
          } else {
            displayResult('Error: No base64 data found in photo object', true);
            displayResult(`Photo object keys: ${Object.keys(photo).join(', ')}`, true);
            return;
          }
          
          displayResult('Sending image to MLPlugin for classification...');
          displayResult(
            `Base64 Data (truncated): ${base64Data.substring(0, 100)}...`
          );
          const result = await MLPlugin.classifyImage({ 
            base64Image: base64Data
          });
          displayResult('Classification result: ' + JSON.stringify(result, null, 2));
          
        } catch (error) {
          displayResult('Classification error: ' + error.message, true);
          console.error('Full error details:', error);
        }
      });

      // Test Gallery Classification button
      self.shadowRoot.querySelector('#test-gallery-classification').addEventListener('click', async function (e) {
        try {
          displayResult('Testing Gallery Image Classification...');
          // Select a photo from the gallery
          const photo = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            quality: 90,
            allowEditing: false,
            source: CameraSource.Photos
          });
          
          // Debug: Log all photo properties
          console.log('Gallery photo object:', photo);
          displayResult(`Photo selected successfully. Available properties: ${Object.keys(photo).join(', ')}`);
          displayResult(`Base64 length: ${photo.base64String ? photo.base64String.length : 'undefined'}`);
          displayResult(`DataUrl length: ${photo.dataUrl ? photo.dataUrl.length : 'undefined'}`);
          
          let base64Data = null;
          
          // Try to get base64 data from different properties
          if (photo.base64String) {
            base64Data = `data:image/jpeg;base64,${photo.base64String}`;
            displayResult('Using base64String property');
          } else if (photo.dataUrl) {
            base64Data = photo.dataUrl;
            displayResult('Using dataUrl property');
          } else {
            displayResult('Error: No base64 data found in photo object', true);
            displayResult(`Photo object keys: ${Object.keys(photo).join(', ')}`, true);
            return;
          }
          
          displayResult('Sending gallery image to MLPlugin for classification...');
          displayResult(
            `Base64 Data (truncated): ${base64Data.substring(0, 100)}...`
          );
          const result = await MLPlugin.classifyImage({ 
            base64Image: base64Data
          });
          displayResult('Gallery Classification result: ' + JSON.stringify(result, null, 2));
          
        } catch (error) {
          displayResult('Gallery Classification error: ' + error.message, true);
          console.error('Full gallery error details:', error);
        }
      });

      // Take Photo button (existing functionality)
      self.shadowRoot.querySelector('#take-photo').addEventListener('click', async function (e) {
        try {
          const photo = await Camera.getPhoto({
            resultType: 'uri',
          });

          const image = self.shadowRoot.querySelector('#image');
          if (!image) {
            return;
          }

          image.src = photo.webPath;
        } catch (e) {
          console.warn('User cancelled', e);
        }
      });
    }
  },
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  },
);
