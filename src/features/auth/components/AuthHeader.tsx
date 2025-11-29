import React from 'react';
import { Logo, Box } from '@/shared/components/ui';

export const AuthHeader = () => {
  return (
    <Box
      alignItems="center"
      justifyContent="flex-end"
      bg="backgroundPrimary"
      style={{ height: '15%' }}
    >
      <Logo size="large" />
    </Box>
  );
};
