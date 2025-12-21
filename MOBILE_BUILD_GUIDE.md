# Mobile App Build Guide

This guide describes how to build an Android APK for your application to test on a physical device.

## Prerequisites

1.  **Expo Account**: You need an account at [expo.dev](https://expo.dev/). If you don't have one, sign up (it's free).
2.  **EAS CLI**: The Expo Application Services CLI is required.

## Step-by-Step Build Instructions

### 1. Install EAS CLI
Run this command in your terminal (if you haven't before):
```bash
npm install -g eas-cli
```

### 2. Login to Expo
Log in to your Expo account:
```bash
npx eas login
```

### 3. Build the APK
Run the build command for the `preview` profile (configured to generate a simplified APK):
```bash
cd mobile
npx eas build -p android --profile preview
```

### 4. Follow Interactive Prompts
- It may ask to **Configure project**. Say **Yes**.
- It may ask to **Generate a new Android Keystore**. Say **Yes**.

### 5. Download & Install
- Once the build finishes (it happens in the cloud and may take 10-15 minutes), you will get a URL.
- Open that URL on your Android phone, download the `.apk`, and install it.
- **Note**: You might need to allow "Install from Unknown Sources" on your phone.

## Troubleshooting

- **Build Queue**: Free tier builds might have a wait time.
- **Errors**: If you see errors, check the logs provided in the link.
