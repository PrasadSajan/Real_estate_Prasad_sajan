# Mobile App Development Plan

## 1. Executive Summary
This document outlines the strategy for extending the "Real Estate Broker" web platform into a mobile application. Leveraging the existing React, TypeScript, and Supabase stack, we can choose between a **Progressive Web App (PWA)** for immediate deployment or a **Native Mobile App (React Native/Expo)** for a premium, app-store-ready experience.

## 2. Strategic Options

### Option A: Progressive Web App (PWA)
*Transform the current website into an installable app.*

*   **Mechanism**: Add a Service Worker and Manifest file to the Next.js project.
*   **User Experience**: Users visit the website and are prompted to "Install App". It appears on their home screen like a native app.
*   **Pros**:
    *   **Fastest Time-to-Market**: Can be implemented in hours.
    *   **Single Codebase**: No new framework to learn; one code source updates both web and mobile.
    *   **Responsive**: Already improved by our mobile-first Tailwind design.
*   **Cons**:
    *   **No App Store Presence**: Cannot be downloaded from Google Play or Apple App Store easily (though trusted web activities exist).
    *   **Limited Native Features**: Limited access to advanced push notifications (iOS limitation), biometrics, etc.

### Option B: Native App with Expo (React Native)
*Build a dedicated mobile application for Google Play and App Store.*

*   **Mechanism**: Create a new React Native project using Expo.
*   **User Experience**: Standard download from App Stores. High-performance native UI.
*   **Pros**:
    *   **Native Performance**: Smoother animations and transitions (60fps).
    *   **Device Features**: Full access to Camera, Push Notifications, Biometric Login (FaceID), Maps/GPS.
    *   **Brand Presence**: Discoverable on App Stores.
*   **Cons**:
    *   **Development Effort**: Requires building a new UI (cannot directly copy-paste HTML/CSS, though logic/types are reusable).
    *   **Maintenance**: Two codebases to maintain (Web and Mobile), unless we move to a Monorepo architecture.

## 3. Technology Stack Recommendation (for Option B)

If a native app is chosen, we recommend the following stack to maximize code reuse:

*   **Framework**: **Expo** (Managed React Native workflow).
*   **Language**: **TypeScript** (Share types with the web project).
*   **Styling**: **NativeWind** (Allows using Tailwind CSS classes in React Native - critical for consistency with web).
*   **Backend**: **Supabase** (Reuse the exact same database and authentication).
*   **Navigation**: **Expo Router** (File-based routing, similar to Next.js App Router).

## 4. Implementation Roadmap

### Phase 1: Preparation & PWA (Recommended First Step)
1.  **Optimize Mobile Web**: Ensure all pages (especially Property Details and Maps) are perfect on mobile browsers.
2.  **Enable PWA**: Add `next-pwa` to the project.
3.  **Test**: Verify "Add to Home Screen" functionality and offline pages.

### Phase 2: Native App Setup (If Option B is selected)
1.  **Initialize Expo**: Create a `mobile/` directory in the current root.
2.  **Setup Shared Environment**: Configure TypeScript to share `src/types` and `src/data` between Web and Mobile.
3.  **Setup NativeWind**: Configure Tailwind for the mobile app.

### Phase 3: Core Features Development
1.  **Authentication**: Implement Login/Signup (reusing Supabase Auth).
2.  **Home Feed**: Build the property listing feed using FlatList (native list component).
3.  **Property Details**: Create a dedicated screen for property views.
4.  **Map Integration**: Use `react-native-maps` for the property locator.

## 5. Decision Needed

**Selected Path:** Path 2 (Native App) - *Initialization Complete*

## Verified Plan

1.  [x] **Initialize Expo**: Created `mobile/` directory.
2.  [x] **Configure Shared Paths**: Updated `metro.config.js` and `tsconfig.json`.
3.  [x] **Install Essential Libs**: Installed `nativewind`, `expo-router`, etc.
4.  [x] **Build Home Screen**: Replicated the web homepage using Native components.
6.  [x] **Bottom Navigation**: Add tabs for Home, Search, Saved, Profile.
7.  [x] **Search Functionality**: Implement search filtering (search by text, min/max price, location).
8.  [x] **APK Build**: Successfully built Android APK (SDK 51).
9.  [ ] **Saved Properties**: Implement local storage for favorites using `expo-secure-store` or async storage.
