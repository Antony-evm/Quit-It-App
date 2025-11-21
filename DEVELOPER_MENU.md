# Developer Menu

The Developer Menu provides debugging and testing tools for the Quit-It app during development.

## Accessing the Developer Menu

The developer menu is only available in development builds (`__DEV__ === true`).

### How to Open

1. Look for the "DEV" button in the top-right corner of the app
2. Tap it 5 times quickly (within 2 seconds between taps)
3. A counter will show your progress (e.g., "3/5")
4. The developer menu will open after 5 taps

## Features

### Authentication Section

- **Show User Info**: Displays current user authentication state, IDs, and profile information
- **Clear Auth Tokens**: Removes stored JWT and session tokens from AsyncStorage
- **Force Logout**: Executes a complete logout process
- **Refresh User Data**: Refreshes user authentication state

### Storage Section

- **Show AsyncStorage**: Displays all keys and values stored in AsyncStorage
- **Clear All Storage**: Removes ALL data from AsyncStorage (use with caution)

### App Info Section

- **Show App Debug Info**: Displays development build status, screen dimensions, and platform info
- **Test Network Connection**: Tests internet connectivity using a public API
- **Real-time Info Display**: Shows authentication status, screen size, user details, and development mode

## Usage for Debugging Authentication Issues

The developer menu is particularly useful for debugging JWT token and authentication problems:

1. **Check Auth State**: Use "Show User Info" to see current authentication status
2. **View Stored Data**: Use "Show AsyncStorage" to inspect stored tokens and user data
3. **Clear Tokens**: Use "Clear Auth Tokens" to remove cached tokens for fresh login testing
4. **Force Clean State**: Use "Force Logout" followed by "Clear All Storage" for complete reset
5. **Test Network**: Use "Test Network Connection" to verify API connectivity

## Development Workflow

### Fresh Authentication Testing

1. Open developer menu (5 taps on DEV button)
2. Tap "Force Logout"
3. Tap "Clear Auth Tokens" or "Clear All Storage"
4. Try fresh signup/login flow

### Debugging Token Issues

1. After experiencing 401 errors, open developer menu
2. Tap "Show AsyncStorage" to inspect stored tokens
3. Check if tokens look valid or expired
4. Clear tokens and retry authentication

### Network Debugging

1. If API calls are failing, use "Test Network Connection"
2. Check if basic internet connectivity works
3. Compare with actual API endpoints if network test passes

## Safety Features

- **Development Only**: Menu only appears in development builds
- **Confirmation Dialogs**: Destructive actions (like clearing all storage) require confirmation
- **Non-Blocking**: Menu doesn't interfere with normal app functionality
- **Easy Dismissal**: Tap the X button or outside the menu to close

## Implementation Details

- **Trigger**: 5 rapid taps on floating DEV button
- **Persistence**: Menu state doesn't persist between app sessions
- **AsyncStorage Integration**: Direct access to stored authentication data
- **Theme Consistent**: Uses app's color palette for consistent styling
- **Responsive**: Adapts to different screen sizes

## Troubleshooting

If the developer menu doesn't appear:

1. Ensure you're running a development build (`__DEV__ === true`)
2. Look for the "DEV" button in the top-right corner
3. Tap exactly 5 times quickly (counter should increment)
4. Check console for any JavaScript errors

## Best Practices

- **Use Sparingly**: Only open when actively debugging
- **Clear Data Carefully**: "Clear All Storage" removes ALL app data
- **Document Issues**: Note AsyncStorage contents when reporting bugs
- **Test Network First**: Use network test before assuming API issues
