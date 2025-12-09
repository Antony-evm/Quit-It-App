import { AppIcon, Box } from '@/shared/components/ui';
import LogoSvg from '@/assets/logo.svg';

export const AuthHeader = () => {
  return (
    <Box variant="authHeader">
      <AppIcon icon={LogoSvg} variant="logo" />
    </Box>
  );
};
