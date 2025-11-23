# 🏥 Appointment & Test Tracker

> **Kiro Week 1 Challenge** - AI for Bharat Event by Hack2Skill

A modern, beautiful, and accessible web application for managing medical appointments and tests with a stunning Neomorphism 2.0 design.

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

### Core Features
- 📅 **Add Appointments** - Create appointments with name, date/time, location, and preparation notes
- 📋 **View Appointments** - See all appointments sorted chronologically
- ✅ **Mark as Done** - Complete appointments and remove them from active list
- 🗑️ **Delete Appointments** - Permanently remove appointments
- 🖨️ **Printable Checklist** - Generate printer-friendly appointment lists
- 💾 **Local Storage** - Automatic data persistence in browser

### Advanced Features
- 📆 **Google Calendar Integration** - Sync appointments with Google Calendar
- 🔍 **Filter & Search** - Filter by date range or search by keyword
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ♿ **Accessibility** - WCAG 2.1 compliant with keyboard navigation
- 🎨 **Neomorphism 2.0 Design** - Modern, soft UI with depth and shadows

### Technical Features
- ⚡ **Fast Performance** - Optimized with React memoization
- 🧪 **Property-Based Testing** - Comprehensive test coverage with fast-check
- 🔒 **Type Safety** - Full TypeScript implementation
- 🎯 **Context API** - Efficient state management
- 🚀 **Production Ready** - Optimized build with Vite

---

## 🎬 Demo

### Screenshots

**Light Mode - Main Interface**
![Light Mode](https://via.placeholder.com/800x450/E0E5EC/2D3748?text=Appointment+Tracker+-+Light+Mode)

**Dark Mode - Appointment List**
![Dark Mode](https://via.placeholder.com/800x450/1A202C/F7FAFC?text=Appointment+Tracker+-+Dark+Mode)

**Mobile Responsive**
![Mobile View](https://via.placeholder.com/400x700/E0E5EC/2D3748?text=Mobile+View)

### Live Demo
🔗 [View Live Demo](https://your-app.vercel.app) _(Coming Soon)_

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2.0** - UI library for building user interfaces
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.2.4** - Next-generation frontend tooling

### Styling
- **CSS3** - Custom styling with CSS variables
- **Neomorphism 2.0** - Modern soft UI design
- **Responsive Design** - Mobile-first approach

### State Management
- **React Context API** - Global state management
- **React Hooks** - useState, useEffect, useReducer, useContext

### Testing
- **Vitest 4.0.13** - Fast unit test framework
- **React Testing Library 16.3.0** - Component testing
- **fast-check 4.3.0** - Property-based testing
- **jest-axe 10.0.0** - Accessibility testing

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Happy DOM** - Lightweight DOM implementation for testing

### APIs & Integration
- **Google Calendar API** - Calendar synchronization (optional)
- **LocalStorage API** - Client-side data persistence

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Appointment  │  │   Filter     │  │   Theme      │     │
│  │    Form      │  │   Panel      │  │   Toggle     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT CONTEXT API                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │           AppContext (Global State)                │     │
│  │  • Appointments List                               │     │
│  │  • Theme Preference                                │     │
│  │  • Filter State                                    │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Storage     │  │  Validation  │  │   Google     │     │
│  │  Service     │  │  Service     │  │   Calendar   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE                          │
│  ┌──────────────┐                    ┌──────────────┐       │
│  │ LocalStorage │                    │   Google     │       │
│  │   (Browser)  │                    │   Calendar   │       │
│  └──────────────┘                    └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Header
│   ├── Title
│   └── ThemeToggle
├── Main
│   ├── AppointmentForm
│   │   ├── Input Fields
│   │   └── Submit Button
│   ├── FilterPanel (Optional)
│   │   ├── Keyword Search
│   │   └── Date Range Filter
│   ├── GoogleCalendarIntegration (Optional)
│   │   ├── Connect Button
│   │   ├── Reminder Settings
│   │   └── Status Indicator
│   ├── AppointmentList
│   │   └── AppointmentItem[]
│   │       ├── Appointment Details
│   │       ├── Done Button
│   │       └── Delete Button
│   └── PrintableChecklist
│       └── Checklist Items
└── Footer
```

### Data Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Component   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Dispatch    │
│  Action      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Reducer     │
│  (Context)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Update      │
│  State       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Storage     │
│  Service     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ LocalStorage │
└──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+
- **npm** or **yarn** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NarenCandy/Appointment_and_test_tracker.git
   cd Appointment_and_test_tracker/appointment-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**
   ```bash
   cp .env.example .env
   # Edit .env and add your Google Calendar API credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the `appointment-tracker` directory:

```env
# Google Calendar API (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### Getting Google Calendar Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-domain.com` (production)
7. Copy **Client ID** and **API Key**
8. Add them to your `.env` file

**Note:** The app works perfectly without Google Calendar integration. This is an optional feature.

---

## 💻 Usage

### Adding an Appointment

1. Fill in the appointment form:
   - **Name** (required): e.g., "Blood Sugar Test"
   - **Date & Time** (required): Select future date/time
   - **Location** (optional): e.g., "City Hospital"
   - **Preparation Notes** (optional): e.g., "Fasting required"
2. Click **"Add Appointment"**
3. Appointment appears in the list below

### Managing Appointments

- **Mark as Done**: Click the ✓ Done button
- **Delete**: Click the 🗑 Delete button
- **View Details**: All information displayed in the card

### Filtering Appointments

1. Click on the filter panel
2. Enter keyword to search
3. Or select date range
4. Click "Clear Filters" to reset

### Printing Checklist

1. Scroll to "Printable Checklist" section
2. Click browser's print button (Ctrl+P / Cmd+P)
3. Select printer or "Save as PDF"

### Google Calendar Integration

1. Click "Connect to Google Calendar"
2. Sign in with your Google account
3. Grant permissions
4. Select reminder time
5. New appointments will sync to Google Calendar

### Dark Mode

- Click the 🌓 toggle in the header
- Preference is saved automatically

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests Once (CI)
```bash
npm run test:run
```

### Test Coverage

- **Unit Tests**: Component and utility function tests
- **Property-Based Tests**: Randomized input testing with fast-check
- **Accessibility Tests**: WCAG 2.1 compliance with jest-axe
- **Integration Tests**: End-to-end user flows

---

## 📦 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://narencandy.github.io/Appointment_and_test_tracker"

# Deploy
npm run deploy
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📁 Project Structure

```
appointment-tracker/
├── .kiro/                      # Kiro IDE configuration
│   ├── specs/                  # Feature specifications
│   └── steering/               # Development guidelines
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentList.tsx
│   │   ├── AppointmentItem.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── GoogleCalendarIntegration.tsx
│   │   ├── PrintableChecklist.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/               # React Context
│   │   └── AppContext.tsx
│   ├── services/              # Business logic
│   │   ├── storageService.ts
│   │   ├── validationService.ts
│   │   └── googleCalendarService.ts
│   ├── utils/                 # Utility functions
│   │   └── appointmentUtils.ts
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   ├── tests/                 # Test files
│   ├── App.tsx                # Main app component
│   ├── App.css                # Global styles
│   ├── main.tsx               # Entry point
│   └── index.css              # Base styles
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── vercel.json                # Vercel deployment config
├── netlify.toml               # Netlify deployment config
└── README.md                  # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Maintain accessibility standards
- Update documentation
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Event
- **AI for Bharat** - Organized by Hack2Skill
- **Kiro Week 1 Challenge** - Building with AI assistance

### Technologies
- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework
- [fast-check](https://fast-check.dev/) - Property-based testing
- [Google Calendar API](https://developers.google.com/calendar) - Calendar integration

### Design Inspiration
- Neomorphism 2.0 design principles
- Skeuomorphism UI patterns
- Material Design accessibility guidelines

---

## 📞 Contact

**Naren Candy**
- GitHub: [@NarenCandy](https://github.com/NarenCandy)
- Project Link: [https://github.com/NarenCandy/Appointment_and_test_tracker](https://github.com/NarenCandy/Appointment_and_test_tracker)

---

## 🌟 Show Your Support

If you found this project helpful, please give it a ⭐️!

---

<div align="center">

**Built with ❤️ for AI for Bharat - Kiro Week 1 Challenge**

Made by [Naren Candy](https://github.com/NarenCandy) | Powered by [Kiro AI](https://kiro.ai)

</div>
