# Startup Authentication Flow Implementation

## Summary

I've implemented a comprehensive startup authentication flow that checks for tokens in memory, validates their authenticity with Stytch, and navigates users to the appropriate screen based on their authentication state and user status.

## Implementation Components

### 1. Enhanced AuthService (`src/shared/auth/authService.ts`)

**Added Methods:**

- `validateSession(stytchClient)`: Validates stored session tokens with Stytch
- `checkAuthenticationWithValidation(stytchClient)`: Comprehensive auth state check with session validation

**Features:**

- Securely retrieves tokens from Keychain/AsyncStorage
- Validates tokens with Stytch API
- Returns detailed authentication state including session validity

### 2. StartupNavigationHandler (`src/shared/components/StartupNavigationHandler.tsx`)

**Functionality:**

- Wraps the app navigation to handle startup flow
- Checks authentication state on app launch
- Validates session tokens with Stytch
- Navigates based on authentication state and user status

**Navigation Logic:**

1. **No tokens found** → Navigate to Auth screen (signup mode)
2. **Invalid tokens** → Clear tokens and navigate to Auth screen (login mode)
3. **Valid tokens** → Navigate based on user status (questionnaire, paywall, or home)

### 3. LoadingScreen (`src/shared/components/LoadingScreen.tsx`)

**Purpose:**

- Displays a loading indicator while authentication checks are performed
- Provides better user experience during app initialization

### 4. Updated Navigation Types (`src/types/navigation.ts`)

**Enhancement:**

- Added optional `mode` parameter to Auth screen to support login/signup modes
- Enables proper navigation with context about why user is at auth screen

### 5. Updated AppNavigator (`src/navigation/AppNavigator.tsx`)

**Changes:**

- Wrapped navigation stack with `StartupNavigationHandler`
- Removed hard-coded initial route
- Allows dynamic navigation based on authentication state

### 6. Enhanced AuthScreen (`src/features/auth/screens/AuthScreen.tsx`)

**Improvements:**

- Accepts `mode` parameter from navigation
- Sets initial form mode based on navigation context
- Provides appropriate user experience for different scenarios

## Flow Scenarios

### Scenario 1: First-time User (No Tokens)

1. App starts → StartupNavigationHandler checks tokens
2. No tokens found → Navigate to Auth screen (signup mode)
3. User creates account → Automatic navigation based on user status

### Scenario 2: Returning User with Expired Session

1. App starts → StartupNavigationHandler checks tokens
2. Tokens found but Stytch validation fails → Clear invalid tokens
3. Navigate to Auth screen (login mode)
4. User logs in → Automatic navigation based on user status

### Scenario 3: Returning User with Valid Session

1. App starts → StartupNavigationHandler checks tokens
2. Tokens found and Stytch validation succeeds
3. Check user status → Navigate to appropriate screen:
   - Questionnaire incomplete → Navigate to Questionnaire
   - Questionnaire complete, no subscription → Navigate to Paywall
   - Subscribed → Navigate to Home

## Key Benefits

1. **Seamless User Experience**: No unnecessary authentication screens for logged-in users
2. **Security**: Always validates tokens with authentication provider
3. **Context-Aware Navigation**: Users land on the right screen based on their status
4. **Proper Error Handling**: Gracefully handles invalid or expired tokens
5. **Loading States**: Provides visual feedback during authentication checks

## Technical Features

- **Async Token Validation**: Uses Stytch SDK for real-time session validation
- **Secure Storage**: Tokens stored in Keychain (iOS) / Encrypted SharedPreferences (Android)
- **Type Safety**: Full TypeScript support with proper navigation types
- **Error Recovery**: Automatic cleanup of invalid authentication state
- **Loading UI**: Prevents blank screens during initialization

## Testing Scenarios

To test the implementation:

1. **Fresh Install**: Clear app data → Should show signup screen
2. **Expired Session**: Manually expire tokens → Should show login screen
3. **Valid Session**: Keep valid tokens → Should navigate to appropriate content screen
4. **Network Issues**: Test with poor connectivity during token validation
5. **Various User Statuses**: Test with users in different onboarding states

This implementation provides a production-ready authentication flow that enhances security while delivering an excellent user experience.
