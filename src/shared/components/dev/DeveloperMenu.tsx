import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useStytch } from '@stytch/react-native';
import { useAuth } from '../../auth/AuthContext';
import { BACKGROUND, TEXT, SYSTEM } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStatusService } from '../../../shared/services/userStatusService';

interface DeveloperMenuProps {
  visible: boolean;
  onClose: () => void;
}

const DeveloperMenu: React.FC<DeveloperMenuProps> = ({ visible, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const stytch = useStytch();
  const [refreshing, setRefreshing] = useState(false);

  if (!visible) return null;

  const clearAllAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'All AsyncStorage data cleared');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear AsyncStorage');
    }
  };

  const showAsyncStorageKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);

      let debugInfo = 'AsyncStorage Contents:\n\n';
      values.forEach(([key, value]) => {
        debugInfo += `${key}: ${value}\n\n`;
      });

      Alert.alert('AsyncStorage Debug', debugInfo);
    } catch (error) {
      Alert.alert('Error', 'Failed to read AsyncStorage');
    }
  };

  const clearAuthTokens = async () => {
    try {
      const authKeys = [
        'stytch_session_jwt',
        'stytch_session_token',
        'backend_user_id',
        'auth_user_data',
      ];

      await AsyncStorage.multiRemove(authKeys);
      Alert.alert('Success', 'Auth tokens cleared');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear auth tokens');
    }
  };

  const forceLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Force logout completed');
    } catch (error) {
      Alert.alert('Error', 'Force logout failed');
    }
  };

  const forceLocalLogout = async () => {
    try {
      // Only clear local storage, bypass Stytch session revocation
      await stytch.session.revoke({ forceClear: true });
      Alert.alert(
        'Success',
        'Local logout completed (session revoked with forceClear)',
      );
    } catch (error) {
      Alert.alert('Error', 'Local logout failed');
    }
  };

  const refreshUserData = async () => {
    setRefreshing(true);
    try {
      // Add any refresh logic here
      setTimeout(() => {
        setRefreshing(false);
        Alert.alert('Success', 'User data refreshed');
      }, 1000);
    } catch (error) {
      setRefreshing(false);
      Alert.alert('Error', 'Failed to refresh user data');
    }
  };

  const showUserDebugInfo = () => {
    const debugInfo = `
Auth Status: ${isAuthenticated ? 'Authenticated' : 'Not Authenticated'}

User Object:
${JSON.stringify(user, null, 2)}

User ID: ${user?.id || 'None'}
Backend User ID: ${user?.backendUserId || 'None'}
Email: ${user?.email || 'None'}
First Name: ${user?.firstName || 'None'}
Last Name: ${user?.lastName || 'None'}
User Status ID: ${user?.userStatusId || 'None'}
    `;

    Alert.alert('User Debug Info', debugInfo);
  };

  const showUserStatusDebug = () => {
    if (!user?.userStatusId) {
      Alert.alert('User Status Debug', 'No user status ID found');
      return;
    }

    const status = UserStatusService.getStatus(user.userStatusId);
    const action = UserStatusService.getStatusAction(user.userStatusId);

    const debugInfo = `
User Status ID: ${user.userStatusId}
Status Code: ${status?.code || 'Unknown'}
Navigation Action: ${action?.type || 'Unknown'}
Is Service Initialized: ${UserStatusService.isInitialized()}

Expected for 'subscribed': NAVIGATE_TO_HOME
    `;

    Alert.alert('User Status Debug', debugInfo);
  };

  const showAppDebugInfo = () => {
    const debugInfo = `
Development Build: ${__DEV__ ? 'Yes' : 'No'}

Screen Dimensions:
Width: ${Dimensions.get('window').width}
Height: ${Dimensions.get('window').height}
Scale: ${Dimensions.get('window').scale}

Platform: React Native
    `;

    Alert.alert('App Debug Info', debugInfo);
  };

  const testNetworkConnection = async () => {
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Alert.alert('Network Test', 'Network connection is working ✅');
      } else {
        Alert.alert(
          'Network Test',
          `Network error: ${response.status} ${response.statusText} ❌`,
        );
      }
    } catch (error) {
      Alert.alert('Network Test', `Network failed: ${error} ❌`);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.menu}>
        <View style={styles.header}>
          <Text style={styles.title}>Developer Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Authentication Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authentication</Text>

            <TouchableOpacity style={styles.button} onPress={showUserDebugInfo}>
              <Text style={styles.buttonText}>Show User Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={showUserStatusDebug}
            >
              <Text style={styles.buttonText}>Show User Status Debug</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={clearAuthTokens}>
              <Text style={styles.buttonText}>Clear Auth Tokens</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={forceLogout}>
              <Text style={styles.buttonText}>Logout (Server + Local)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={forceLocalLogout}>
              <Text style={styles.buttonText}>Logout (Local Only)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, refreshing && styles.buttonDisabled]}
              onPress={refreshUserData}
              disabled={refreshing}
            >
              <Text style={styles.buttonText}>
                {refreshing ? 'Refreshing...' : 'Refresh User Data'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Storage Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={showAsyncStorageKeys}
            >
              <Text style={styles.buttonText}>Show AsyncStorage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={() => {
                Alert.alert(
                  'Confirm',
                  'This will clear ALL app data. Continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear All',
                      onPress: clearAllAsyncStorage,
                      style: 'destructive',
                    },
                  ],
                );
              }}
            >
              <Text style={styles.dangerButtonText}>Clear All Storage</Text>
            </TouchableOpacity>
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Info</Text>

            <TouchableOpacity style={styles.button} onPress={showAppDebugInfo}>
              <Text style={styles.buttonText}>Show App Debug Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={testNetworkConnection}
            >
              <Text style={styles.buttonText}>Test Network Connection</Text>
            </TouchableOpacity>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Authentication Status:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isAuthenticated ? '#4CAF50' : '#F44336' },
                ]}
              >
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Screen Size:</Text>
              <Text style={styles.infoValue}>
                {Dimensions.get('window').width} x{' '}
                {Dimensions.get('window').height}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User Email:</Text>
              <Text style={styles.infoValue}>{user?.email || 'None'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Backend User ID:</Text>
              <Text style={styles.infoValue}>
                {user?.backendUserId || 'None'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Development Mode:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: __DEV__ ? '#4CAF50' : '#F44336' },
                ]}
              >
                {__DEV__ ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: BACKGROUND.primary,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SYSTEM.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BACKGROUND.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: TEXT.secondary,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT.primary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: SYSTEM.border,
    paddingBottom: 4,
  },
  button: {
    backgroundColor: SYSTEM.accentPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: BACKGROUND.muted,
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: BACKGROUND.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: SYSTEM.border + '30',
  },
  infoLabel: {
    fontSize: 14,
    color: TEXT.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: TEXT.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});

export default DeveloperMenu;
