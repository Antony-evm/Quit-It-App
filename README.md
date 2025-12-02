# Quit-It App

A React Native mobile application designed to help users quit smoking through personalized tracking, journaling, and progress monitoring.

## Overview

Quit-It is a cross-platform (iOS & Android) smoking cessation app built with modern React Native architecture. It provides users with tools to track cravings, monitor progress, and stay motivated on their journey to quit smoking.

## Features

- **Authentication** - Secure user authentication via Stytch
- **Personalized Onboarding** - Questionnaire-based setup to customize the experience
- **Craving Tracking** - Log and analyze craving patterns over time
- **Journaling** - Document thoughts and triggers with timestamped notes
- **Progress Analytics** - Visual charts showing smoking/craving trends
- **Subscription Paywall** - Premium features via in-app purchases

## Tech Stack

| Category             | Technology                             |
| -------------------- | -------------------------------------- |
| Framework            | React Native 0.82                      |
| Language             | TypeScript (strict mode)               |
| Navigation           | React Navigation 7                     |
| State Management     | React Query (TanStack Query)           |
| Authentication       | Stytch                                 |
| Internationalization | i18next                                |
| Styling              | Custom theme system with design tokens |

## Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication flow
│   ├── home/          # Home dashboard
│   ├── journal/       # Note-taking feature
│   ├── tracking/      # Craving/smoking tracking
│   ├── questionnaire/ # Onboarding questionnaire
│   ├── paywall/       # Subscription handling
│   └── account/       # User settings
├── navigation/        # Navigation configuration
├── shared/            # Shared utilities
│   ├── api/          # API client & endpoints
│   ├── auth/         # Auth context & services
│   ├── components/   # Reusable UI components
│   ├── constants/    # App-wide constants
│   ├── error/        # Centralized error handling
│   ├── hooks/        # Shared custom hooks
│   ├── i18n/         # Internationalization
│   ├── services/     # Business logic services
│   ├── theme/        # Design tokens & styling
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Utility functions
├── types/            # Global type definitions
└── utils/            # Root-level utilities
```

## Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment ([setup guide](https://reactnative.dev/docs/set-up-your-environment))
- iOS: Xcode, CocoaPods
- Android: Android Studio, JDK

### Installation

```bash
# Clone the repository
git clone https://github.com/Antony-evm/Quit-It-App.git
cd Quit-It-App

# Install dependencies
npm install

# iOS only: Install CocoaPods
bundle install
bundle exec pod install
```

### Environment Setup

Create environment configuration for your API endpoints:

```bash
# The app resolves API_BASE_URL from environment variables
# For local development, it defaults to:
# - Android: http://10.0.2.2:8000
# - iOS: http://localhost:8000
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Reset cache if needed
npm start -- --reset-cache
```

## Development

### Code Standards

This project follows strict development guidelines defined in [`rules.md`](./rules.md):

- **Feature-based architecture** - Code organized by feature, not file type
- **TypeScript strict mode** - No `any` types allowed
- **Separation of concerns** - Logic in hooks, UI in components, screens as orchestrators
- **React Query** - For all server state management
- **Centralized theming** - All styles use design tokens

### Key Commands

```bash
npm run lint      # Run ESLint
npm test          # Run Jest tests
npm run android   # Build and run on Android
npm run ios       # Build and run on iOS
```

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
import { useAuth } from '@/shared/auth';
import { AppButton } from '@/shared/components/ui';
```

## Documentation

- [`rules.md`](./rules.md) - Development principles and coding standards
- [`improvements.md`](./improvements.md) - Known issues and enhancement backlog
- [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) - Backend API documentation

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- dateUtils.test.ts
```

## Contributing

1. Follow the guidelines in `rules.md`
2. Ensure TypeScript strict compliance
3. Add tests for new business logic
4. Use conventional commit messages

## License

Private - All rights reserved
