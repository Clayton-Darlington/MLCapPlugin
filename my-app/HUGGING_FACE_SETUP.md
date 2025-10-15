# Hugging Face Authentication Setup

## Getting Your Hugging Face Token

1. **Create a Hugging Face Account**: 
   - Go to [https://huggingface.co](https://huggingface.co) and create an account

2. **Generate an Access Token**:
   - Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Click "Create new token"
   - Give it a name (e.g., "Native ML Demo")
   - Select "Read" permissions
   - Copy the generated token

3. **Request Access to the Gemma Model**:
   - Go to [https://huggingface.co/google/gemma-3n-E2B-it-litert-lm](https://huggingface.co/google/gemma-3n-E2B-it-litert-lm)
   - Click "Request Access" and follow the instructions
   - Wait for approval (usually takes a few minutes to hours)

## Setting Up Authentication

### Option 1: Environment Variable (Recommended)
```bash
# Set environment variable
export HUGGING_FACE_TOKEN="hf_your_token_here"

# Then build and run
npm run build
npx cap sync ios
npx cap run ios
```

### Option 2: Direct Configuration
Update the token in one of these files:

**For Development:**
`src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  huggingFaceToken: 'hf_your_actual_token_here'
};
```

**For Production:**
`src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  huggingFaceToken: 'hf_your_actual_token_here'
};
```

**Direct in Capacitor Config:**
`capacitor.config.ts`
```typescript
MLPlugin: {
  modelPath: "gemma-3n-E4B-it-int4-Web.litertlm",
  huggingFaceToken: "hf_your_actual_token_here",
  modelUrl: "https://huggingface.co/google/gemma-3n-E2B-it-litert-lm/resolve/main/model.litertlm"
}
```

## Security Notes

- **Never commit your token to version control**
- Add your token files to `.gitignore` if modified
- Use environment variables in production
- Tokens should start with `hf_`

## Testing

After setting up your token:

1. Build the app: `npm run build`
2. Sync with Capacitor: `npx cap sync ios`
3. Run on iOS: `npx cap run ios`
4. Test the "Generate Text" feature in the app

The app will show an error message if the token is not configured properly.