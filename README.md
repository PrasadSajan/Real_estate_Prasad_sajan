# Modern Real Estate Platform

A premium, localized real estate website built with Next.js 16, Supabase, and Tailwind CSS.
This platform allows users to browse properties with an interactive map, inquire about listings, and includes a full admin dashboard for property management.

## 🚀 Features

-   **Browse Properties**: Advanced filtering and search for improved discovery.
-   **Interactive Maps**: Dynamic property locations using Leaflet (OpenStreetMap) integration.
-   **Property Details**: High-quality image galleries and detailed specifications.
-   **AI Property Concierge**: Integrated Gemini-powered chatbot to answer user questions about listings.
-   **Localization**: Full Marathi translation support for wider reach.
-   **Admin Dashboard**:
    -   Secure Admin Login.
    -   Manage Properties (Add, Edit, Delete).
    -   Admin Inbox: View and manage customer inquiries.
    -   Map Picker for setting property coordinates.
-   **Contact System**: Integrated inquiry forms with Toast notifications and email/database storage.
-   **Responsive Design**: Mobile-first, glassmorphism-inspired UI designed with Tailwind CSS.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
-   **Backend**: Supabase (PostgreSQL, Auth, Storage)
-   **Maps**: Leaflet, React-Leaflet
-   **AI**: Google Gemini API (`@google/generative-ai`)
-   **Icons**: Lucide React
-   **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

-   Node.js 18.17 or later
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/PrasadSajan/Real_estate_Prasad_sajan.git
    cd real-estate-website
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add the following keys:

    ```bash
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    # AI Chatbot (Gemini)
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `src/app`: App directory (Pages & API Routes).
-   `src/components`: Reusable UI components (Hero, PropertyCard, Maps, etc.).
-   `src/lib`: Utility functions and Supabase client.
-   `src/context`: React Contexts (Language, etc.).
-   `src/types`: TypeScript interfaces.
