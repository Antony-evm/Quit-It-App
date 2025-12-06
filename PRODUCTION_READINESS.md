# Production Readiness Checklist

**Status**: ⚠️ **NOT READY FOR PRODUCTION**

**Last Updated**: December 5, 2025

---

## 🚨 Critical Issues (MUST FIX)

### 1. Android Release Signing Not Configured

**Current State**: ❌ **BLOCKING RELEASE**

**Location**: `android/app/build.gradle` (line 100-106)

**Problem**:

```gradle
release {
    // Caution! In production, you need to generate your own keystore file.
    // see https://reactnative.dev/docs/signed-apk-android.
    signingConfig = signingConfigs.debug  // ❌ USING DEBUG KEYSTORE!
    minifyEnabled enableProguardInReleaseBuilds
    proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
}
```

Release builds are currently signed with the **debug keystore** (`debug.keystore`). This means:

- ❌ **Google Play Store will reject your app**
- ❌ You cannot publish production updates
- ❌ Users cannot install over the debug version
- ❌ Insecure - debug keys are publicly known

**What You Need**: A **Release Keystore** (also called a signing certificate)

#### What is a Release Keystore?

A keystore is a binary file (`.keystore` or `.jks`) that contains:

- **Private key**: Used to cryptographically sign your APK/AAB
- **Public certificate**: Proves the app comes from you
- **Keystore password**: Protects the keystore file
- **Key alias**: Name of the specific key inside the keystore
- **Key password**: Protects the specific key

**CRITICAL**: If you lose this keystore, you can **NEVER** update your app on Google Play. You'd have to publish a completely new app with a new package name.

#### How to Fix:

**Step 1: Generate a Release Keystore** (One-time setup)

```bash
# Navigate to android/app directory
cd android/app

# Generate keystore (interactive - you'll be asked for passwords and info)
keytool -genkeypair -v -storetype PKCS12 -keystore quit-it-release.keystore -alias quit-it-key -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# - Keystore password (choose strong password, SAVE IT SECURELY)
# - Key password (can be same as keystore password)
# - Your name/organization details
```

**Important Information to Provide**:

- First and last name: Your name or company name
- Organizational unit: Your team/department (e.g., "Development")
- Organization: Your company name (e.g., "Quit-It App")
- City/Locality: Your city
- State/Province: Your state
- Country code: Two letter code (e.g., "US", "GB")

**Step 2: Store Keystore Securely**

```bash
# Move keystore to a secure location OUTSIDE the git repo
# NEVER commit this to git!
mv quit-it-release.keystore ~/secure-keys/
# Or on Windows:
# Move-Item quit-it-release.keystore $HOME\secure-keys\
```

Also backup to:

- ✅ Password manager (1Password, LastPass, etc.)
- ✅ Encrypted cloud storage
- ✅ Secure company vault
- ✅ Physical secure location

**Step 3: Configure Gradle**

Create `android/gradle.properties` (if not exists) and add (with YOUR actual values):

```properties
# NEVER commit these actual values to git!
# These should be in a local file or CI/CD secrets

MYAPP_RELEASE_STORE_FILE=~/secure-keys/quit-it-release.keystore
MYAPP_RELEASE_KEY_ALIAS=quit-it-key
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password_here
MYAPP_RELEASE_KEY_PASSWORD=your_key_password_here
```

**Add to `.gitignore`**:

```
# Add this line to ensure you don't commit passwords
gradle.properties
```

**Step 4: Update build.gradle**

Replace the current signing config in `android/app/build.gradle`:

```gradle
android {
    // ... existing config ...

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release  // ✅ Now uses release keystore
            minifyEnabled true  // Enable code shrinking
            shrinkResources true  // Remove unused resources
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

**Step 5: Test Release Build**

```bash
cd android
./gradlew assembleRelease

# If successful, you'll find the signed APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

### 2. Code Obfuscation Disabled

**Current State**: ❌ **SECURITY RISK**

**Location**: `android/app/build.gradle` (line 61)

**Problem**:

```gradle
def enableProguardInReleaseBuilds = false  // ❌ NOT PRODUCTION READY
```

**Impact**:

- ❌ JavaScript bundle is fully readable (anyone can see your code)
- ❌ Native code (Java/Kotlin) is not minified
- ❌ Larger APK size (slower downloads)
- ❌ API endpoints, business logic visible
- ❌ Easier to reverse engineer and clone your app

**Fix**:

```gradle
def enableProguardInReleaseBuilds = true  // ✅ Enable in production
```

---

### 3. ProGuard Rules Empty

**Current State**: ❌ **WILL BREAK RELEASE BUILD**

**Location**: `android/app/proguard-rules.pro`

**Problem**: File is completely empty. When you enable ProGuard, the app will crash because essential classes will be removed/renamed.

**Fix**: Add comprehensive ProGuard rules:

```pro
# Add project specific ProGuard rules here.

# ==================== REACT NATIVE ====================
# Keep React Native core classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep native modules
-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }

# ==================== STYTCH SDK ====================
# Keep Stytch authentication SDK classes
-keep class com.stytch.** { *; }
-dontwarn com.stytch.**

# ==================== REACT NATIVE KEYCHAIN ====================
# Keep keychain classes for secure storage
-keep class com.oblador.keychain.** { *; }
-dontwarn com.oblador.keychain.**

# ==================== ASYNC STORAGE ====================
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-dontwarn com.reactnativecommunity.asyncstorage.**

# ==================== REACT NATIVE CONFIG ====================
-keep class com.lugg.ReactNativeConfig.** { *; }
-dontwarn com.lugg.ReactNativeConfig.**

# ==================== REACT NATIVE SVG ====================
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# ==================== GENERAL ANDROID ====================
# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep custom view classes
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}

# Keep Parcelable classes
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ==================== CRASH REPORTING ====================
# Keep source file names and line numbers for crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep annotations
-keepattributes *Annotation*

# ==================== DEBUGGING ====================
# Remove all logging in release (optional - be careful!)
# -assumenosideeffects class android.util.Log {
#     public static *** d(...);
#     public static *** v(...);
#     public static *** i(...);
# }
```

**Testing After ProGuard**:

1. Build release APK: `./gradlew assembleRelease`
2. Test on physical device thoroughly
3. Check for crashes in areas with native modules
4. If crashes occur, add more `-keep` rules for affected classes

---

### 4. Missing Environment Variable Validation

**Current State**: ⚠️ **APP WILL RUN WITH INVALID CONFIG**

**Location**: `App.tsx` (line 23-29)

**Problem**:

```typescript
const stytchToken = Config.STYTCH_PUBLIC_TOKEN || 'public-token-placeholder';

if (!Config.STYTCH_PUBLIC_TOKEN) {
  console.error(
    'STYTCH_PUBLIC_TOKEN is not configured. Please add it to your .env file.',
  );
}
// ❌ App continues to run with fake placeholder token!
```

**Impact**:

- App runs but authentication fails silently
- Poor user experience in production
- Hard to debug configuration issues

**Fix**:

```typescript
const stytchToken = Config.STYTCH_PUBLIC_TOKEN;

if (!stytchToken) {
  const errorMessage =
    'STYTCH_PUBLIC_TOKEN is not configured. Please add it to your .env file.';

  if (__DEV__) {
    console.error(errorMessage);
    // In development, you might use a test token or show a warning screen
  } else {
    // In production, fail fast - don't let the app continue with invalid config
    throw new Error(errorMessage);
  }
}

const stytchClient = new StytchClient(stytchToken);
```

**Environment Variable Checklist**:

- [ ] `STYTCH_PUBLIC_TOKEN` - Authentication service token
- [ ] `API_BASE_URL` or similar - Backend API URL
- [ ] Verify production `.env` file has production values (not localhost)

---

### 5. Security Vulnerability in Dependencies

**Current State**: ⚠️ **MODERATE SEVERITY**

**Vulnerability**: `js-yaml` prototype pollution vulnerability

**Details**:

```
js-yaml  <3.14.2 || >=4.0.0 <4.1.1
Severity: moderate
Prototype pollution in merge (<<)
CVE: GHSA-mh29-5h37-fv8m
```

**Impact**:

- Potential for malicious code injection
- Could affect app security if exploited

**Fix**:

```bash
npm audit fix
```

**Verification**:

```bash
npm audit
# Should show: "found 0 vulnerabilities"
```

---

## ⚠️ High Priority Issues

### 6. Console Logs Not Stripped in Production

**Current State**: ❌ **PERFORMANCE & SECURITY ISSUE**

**Problem**: Found 50+ `console.log()`, `console.warn()`, `console.error()` statements throughout the codebase that will execute in production.

**Files with Most Logs**:

- `src/shared/auth/authBootstrap.ts` (13 logs)
- `src/shared/hooks/useUserDataDebug.ts` (debug logging)
- `src/shared/services/*.ts` (multiple warn logs)
- `src/shared/components/dev/DeveloperMenuTrigger.tsx` (some not gated)

**Impact**:

- 🐌 Performance overhead in production
- 🔓 Sensitive data may be exposed in logs
- 📊 Harder to debug real issues vs development noise

**Fix Option 1**: Babel Plugin (Recommended)

```bash
npm install --save-dev babel-plugin-transform-remove-console
```

```javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ... existing plugins
    [
      'transform-remove-console',
      {
        exclude: ['error', 'warn'], // Keep errors and warnings, remove log/debug/info
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'], // Remove ALL console in production
    },
  },
};
```

**Fix Option 2**: Manual Gating

Add `__DEV__` checks to all console statements:

```typescript
// Before
console.log('[AuthBootstrap] Starting bootstrap');

// After
if (__DEV__) {
  console.log('[AuthBootstrap] Starting bootstrap');
}
```

---

### 7. Error Boundary Doesn't Log Errors

**Current State**: ❌ **SILENT FAILURES**

**Location**: `src/shared/error/GlobalErrorBoundary.tsx`

**Problem**:

```typescript
static getDerivedStateFromError(): State {
  return { hasError: true };  // ❌ No error logging at all!
}

// Missing componentDidCatch - errors are swallowed
```

**Impact**:

- You won't know when users experience crashes
- No data to fix bugs
- Poor user experience with no insights

**Fix**:

```typescript
import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by GlobalErrorBoundary:', error);
    console.error('Error info:', errorInfo);

    // TODO: Send to crash reporting service in production
    if (!__DEV__) {
      // Example:
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
      // OR Firebase Crashlytics.recordError(error);
      // OR Bugsnag.notify(error, function (event) { event.addMetadata('react', errorInfo); });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            The app encountered an unexpected error.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetails}>
              {this.state.error.toString()}
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorDetails: {
    fontSize: 12,
    color: '#ff6b6b',
    fontFamily: 'monospace',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

### 8. No Crash Reporting Service Integrated

**Current State**: ❌ **CRITICAL FOR PRODUCTION**

**Problem**: No crash analytics/monitoring service configured.

**Why You Need This**:

- 📊 Track crash rates and stability
- 🐛 Get stack traces from production crashes
- 📈 Monitor app health over time
- 🎯 Prioritize bug fixes based on impact

**Recommended Services** (choose one):

#### Option A: Sentry (Recommended - Best for React Native)

```bash
npm install --save @sentry/react-native
npx @sentry/wizard -i reactNative -p ios android
```

```typescript
// App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE',
  environment: __DEV__ ? 'development' : 'production',
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
});

// Wrap your app
export default Sentry.wrap(App);
```

#### Option B: Firebase Crashlytics (Free)

```bash
npm install --save @react-native-firebase/app @react-native-firebase/crashlytics
```

#### Option C: Bugsnag

```bash
npm install --save @bugsnag/react-native
```

**Integration with Error Boundary**: See fix #7 above for how to send errors to your chosen service.

---

## 📋 Medium Priority Issues

### 9. Outdated Dependencies

**Current State**: ⚠️ **TECHNICAL DEBT**

Run `npm outdated` to see full list. Key updates available:

| Package                          | Current | Latest  | Priority        |
| -------------------------------- | ------- | ------- | --------------- |
| `@react-navigation/native`       | 7.1.19  | 7.1.24  | Medium          |
| `@react-navigation/native-stack` | 7.6.2   | 7.8.5   | Medium          |
| `@stytch/react-native`           | 0.67.1  | 0.69.0  | High (security) |
| `@tanstack/react-query`          | 5.90.5  | 5.90.12 | Medium          |
| `i18next`                        | 25.6.3  | 25.7.1  | Low             |

**Fix**:

```bash
# Update all minor/patch versions
npm update

# Or update individually
npm install @stytch/react-native@latest
npm install @react-navigation/native@latest @react-navigation/native-stack@latest

# Test thoroughly after updates
npm test
npm run android
npm run ios
```

---

### 10. Minimal App Configuration

**Current State**: ⚠️ **INCOMPLETE METADATA**

**Location**: `app.json`

**Current**:

```json
{
  "name": "QuitItApp",
  "displayName": "Quit It"
}
```

**Should Include**:

```json
{
  "name": "QuitItApp",
  "displayName": "Quit It",
  "version": "1.0.0",
  "description": "A smoking cessation app to help users quit smoking",
  "author": "Your Name or Company",
  "license": "Proprietary",
  "repository": {
    "type": "git",
    "url": "https://github.com/Antony-evm/Quit-It-App"
  },
  "bugs": {
    "url": "https://github.com/Antony-evm/Quit-It-App/issues"
  },
  "privacy": "https://yourwebsite.com/privacy",
  "terms": "https://yourwebsite.com/terms"
}
```

---

### 11. Network Security Configuration

**Location**: `android/app/src/main/AndroidManifest.xml`

**Current**:

```xml
android:usesCleartextTraffic="${usesCleartextTraffic}"
```

**Verify**: Ensure this variable is set to `false` in production builds. Check `android/gradle.properties` or build configuration.

**Best Practice**: Add network security config file for Android:

**Create** `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <!-- Only for development - remove in production -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

**Update AndroidManifest.xml**:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

---

### 12. iOS Release Configuration

**Current State**: ⚠️ **NEEDS VERIFICATION**

**What to Check in Xcode**:

1. **Open** `ios/QuitItApp.xcworkspace` (not .xcodeproj!)

2. **Signing & Capabilities** tab:

   - [ ] Team selected (your Apple Developer account)
   - [ ] Automatic signing enabled, OR
   - [ ] Manual signing with valid provisioning profile
   - [ ] Bundle ID matches App Store Connect (e.g., `com.quititapp`)

3. **Build Settings**:

   - [ ] `MARKETING_VERSION` = 1.0 (currently set ✅)
   - [ ] `CURRENT_PROJECT_VERSION` = 1 (build number)
   - [ ] `Code Signing Identity (Release)` = "iPhone Distribution"

4. **Provisioning Profiles**:
   - Development: For testing on your device
   - Ad Hoc: For TestFlight internal testing
   - App Store: For App Store submission

**Apple Developer Requirements**:

- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Created App ID in developer portal
- [ ] Generated distribution certificates
- [ ] Created provisioning profiles
- [ ] App created in App Store Connect

---

### 13. API Error Handling - Silent Catch Block

**Location**: `src/features/paywall/api/subscriptionApi.ts` (line 21)

**Problem**:

```typescript
} catch (parseError) {}  // ❌ Empty catch - error is completely ignored
```

**Fix**:

```typescript
} catch (parseError) {
  console.error('[SubscriptionAPI] Failed to parse response:', parseError);
  // Or return default value, or re-throw
}
```

---

### 14. Production API Configuration

**Location**: `src/shared/api/apiConfig.ts`

**Current**:

```typescript
const resolveFallbackBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000'; // ⚠️ localhost
  }
  return 'http://localhost:8000'; // ⚠️ localhost
};
```

**Critical**: These are development URLs.

**Before Production**:

1. Set up `.env` file with production values:

   ```
   API_BASE_URL=https://api.your-production-domain.com
   ```

2. Verify production build uses production API:
   ```bash
   # Test that the URL is correct
   # Check app logs or network requests in release build
   ```

---

## 🎯 Pre-Launch Checklist

### Before First Production Build:

- [ ] Generate and secure Android release keystore
- [ ] Configure signing in `build.gradle`
- [ ] Enable ProGuard (`enableProguardInReleaseBuilds = true`)
- [ ] Add comprehensive ProGuard rules
- [ ] Fix `npm audit` vulnerabilities
- [ ] Configure crash reporting service
- [ ] Remove/gate all console logs
- [ ] Add error logging to ErrorBoundary
- [ ] Validate environment variables throw errors when missing
- [ ] Update dependencies to latest stable versions
- [ ] Set production API URL in `.env`
- [ ] Test release build on physical devices (Android & iOS)
- [ ] Verify ProGuard doesn't break app functionality

### Before App Store Submission:

- [ ] Configure iOS signing certificates
- [ ] Create privacy policy page (required by both stores)
- [ ] Create terms of service page
- [ ] Prepare app screenshots
- [ ] Write app description
- [ ] Set up support email/website
- [ ] Test in-app purchases (if applicable)
- [ ] Test on multiple device sizes
- [ ] Test on oldest supported OS version
- [ ] Run accessibility audit
- [ ] Verify all strings are internationalized
- [ ] Test offline functionality
- [ ] Verify analytics tracking works
- [ ] Create App Store Connect listing (iOS)
- [ ] Create Google Play Console listing (Android)

### After Launch:

- [ ] Monitor crash reports
- [ ] Track user feedback
- [ ] Set up alerts for high crash rates
- [ ] Plan regular dependency updates
- [ ] Monitor API error rates
- [ ] Track app performance metrics

---

## 📚 Additional Resources

### Android Signing:

- [Official React Native Docs](https://reactnative.dev/docs/signed-apk-android)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)

### iOS Signing:

- [Apple Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [App Distribution Guide](https://developer.apple.com/distribute/)

### ProGuard:

- [ProGuard Manual](https://www.guardsquare.com/manual/home)
- [React Native ProGuard](https://reactnative.dev/docs/signed-apk-android#enabling-proguard-to-reduce-the-size-of-the-apk-optional)

### Crash Reporting:

- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)
- [Firebase Crashlytics](https://rnfirebase.io/crashlytics/usage)

---

## 🔒 Security Best Practices

1. **Never Commit Secrets**:

   - Keystores
   - Passwords
   - API keys
   - Environment files with production values

2. **Use Environment Variables**:

   - Different values for dev/staging/prod
   - Store in CI/CD secrets for automated builds

3. **Enable All Security Features**:

   - ProGuard/R8 obfuscation
   - Code signing
   - Network security config
   - Certificate pinning (advanced)

4. **Regular Updates**:
   - Dependencies (monthly)
   - Security patches (immediately)
   - OS version support

---

## 📞 Support

For questions about this checklist or implementation help:

- Check React Native documentation
- Review this project's `rules.md` for coding standards
- Consult with your team's mobile lead
- Reach out to platform support (Apple/Google) for store-specific questions
