# Mobile App Testing Guide

This guide explains how to run and test your new mobile application on your physical device or an emulator.

## Prerequisites

1.  **Phone:** Android or iOS device.
2.  **App:** Install **Expo Go** from the Google Play Store or Apple App Store.
3.  **Network:** Ensure your phone and computer are on the **SAME Wi-Fi network**.

## How to Run the App

1.  **Open Terminal** in the `mobile` folder:
    ```powershell
    cd mobile
    npx expo start
    ```

2.  **You will see a QR Code** in the terminal.

3.  **Connect your Device:**
    *   **Android:** Open "Expo Go", tap "Scan QR Code", and scan the code from your terminal.
    *   **iOS:** Open the standard "Camera" app, scan the QR code, and tap the notification to open in "Expo Go".

4.  **Emulators (Optional):**
    *   If you have Android Studio installed, press `a` in the terminal to open on Android Emulator.
    *   If you are on a Mac with Xcode, press `i` to open on iOS Simulator.

## Troubleshooting

*   **"Something went wrong" / Network Error:**
    *   This usually means your phone cannot reach your computer.
    *   Make sure both are on the same Wi-Fi.
    *   If that fails, try running `npx expo start --tunnel`. This creates a global tunnel (slower, but works across different networks).

*   **Changes not showing?**
    *   Shake your phone to open the developer menu and tap "Reload".
    *   Or simply press `r` in the terminal.

## Current State
You will currently see the default "Open up App.tsx to start working on your app!" screen. This confirms the app is successfully installed and running.
