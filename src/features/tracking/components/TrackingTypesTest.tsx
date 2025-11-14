import React from 'react';
import { View, Text } from 'react-native';
import { useTrackingTypes } from '../hooks/useTrackingTypes';

/**
 * Test component to verify tracking types API call and caching works correctly.
 * This can be used during development to ensure the implementation is working.
 */
export const TrackingTypesTest: React.FC = () => {
  const { data: trackingTypes, isLoading, error, isError } = useTrackingTypes();

  if (isLoading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading tracking types...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Error loading tracking types: {error?.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Tracking Types:
      </Text>
      {trackingTypes?.map(type => (
        <View
          key={type.id}
          style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
        >
          <Text>ID: {type.id}</Text>
          <Text>Display Name: {type.displayName}</Text>
          <Text>Code: {type.code}</Text>
          <Text>Description: {type.description}</Text>
        </View>
      ))}
    </View>
  );
};
