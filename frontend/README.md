# Nexus Health - Frontend 🩺

The premium administrative portal for the Patient Visit Tracker system. Built with React 19 and Tailwind CSS v4.

## 🛠️ Features

- **Auth Portal**: Centered, secure login entry with dynamic background effects.
- **Medical Registry**: Management of clinicians and healthcare staff.
- **Patient Records**: Secure tabulated view of patient demographics and contact info.
- **Encounter Feed**: Timeline-based activity log of all clinical visits.
- **Premium UI**: Glassmorphism 2.0 design system with smooth spring animations.

## 🚀 Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    Copy `.env.example` to `.env` and ensure the API URL is correct:
    ```bash
    cp .env.example .env
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **Production Build**:
    ```bash
    npm run build
    ```

## 🏗️ Technical Architecture

- **React 19**: Utilizing the latest React features for performance.
- **Tailwind CSS v4**: Official `@tailwindcss/vite` plugin for lightning-fast builds and zero-config utility detection.
- **Framer Motion**: Advanced motion design for all transitions and interactions.
- **Lucide React**: Consistent, readable iconography.
- **Axios**: Centralized API client with environment-aware `baseURL`.

## 📁 Folder Structure

- `src/api`: Centralized API client and configuration.
- `src/components/common`: Reusable UI components (Button, Modal, Input, Layout).
- `src/features`: Domain-specific logic and pages (auth, clinicians, patients, visits).
- `src/assets`: Global styles and static resources.
