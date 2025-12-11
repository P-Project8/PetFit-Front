# PetFit - AI-Powered Pet Styling Platform

PetFit is a graduation project dedicated to solving the challenge of finding the perfect style and fit for pets. By integrating Google Gemini AI, we provide a unique "AI Styling" experience where users can visualize outfits on their pets before purchasing.

## Key Features

*   **AI Styling**: Upload a pet's photo and a clothing item to see a realistic AI-generated preview of the fit.
*   **Smart E-commerce**: Intuitive product browsing with "New", "Hot", and "Sale" categories.
*   **User Personalization**:
    *   **Wishlist**: Save favorite items for later.
    *   **Cart**: Easy management of selected products.
    *   **My Page**: Track orders and view profile details.
*   **Responsive Design**: Seamless experience across desktop and mobile devices.

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Styling & UI
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)

### State Management
![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)
*   **Why Zustand?** Chosen for its minimalist API and small bundle size, reducing boilerplate compared to Redux while maintaining scalable state management.
*   **Stores**:
    *   `authStore`: Manages user login state and profile data.
    *   `cartStore`: Handles shopping cart operations (add, remove, update quantities).
    *   `productStore`: Caches product data and handles filtering.

### AI Integration
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
*   Utilizes **Google Gemini API** (specifically `gemini-1.5-flash`) to process image inputs and generate styling previews.

## Major Pages

| Page | Description |
| :--- | :--- |
| **Home** | Features carousel banners, category links, and curated product sections (New/Hot/Sale). |
| **Category** | Browse products by specific categories with filtering options. |
| **AI Styling** | User uploads a pet image and selects a product; AI generates a styling preview. Includes "Magic Wand" visual effects. |
| **Product Detail** | Detailed view of product info, options to add to cart or wishlist. |
| **My Page** | Dashboard for user activity, order history, and account settings. |

## User Flow

The typical user journey in PetFit:

1.  **Onboarding**: User lands on **Home** -> Browses **New/Hot** items.
2.  **Discovery**: User searches or clicks a **Category** -> Selects a **Product**.
3.  **Experience (AI)**: User clicks "AI Styling" on a product -> Uploads pet photo -> Gins preview.
4.  **Action**: User adds item to **Cart** or **Wishlist**.
5.  **Checkout**: User proceeds to **Cart** -> Reviews items -> Simulates Purchase.

## Project Structure

```bash
src
├── components      # Reusable UI components (Layout, Product, AI, etc.)
├── data            # Mock data (products, categories)
├── hooks           # Custom React hooks (e.g., useMediaQuery)
├── pages           # Page-level components (Home, AIStyling, Cart, etc.)
├── services        # API services (Google Gemini integration)
├── store           # Zustand state stores
└── utils           # Helper functions
```

## Getting Started

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/petfit-front.git
    cd petfit-front
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---
*This project was developed as a Graduation Project.*
