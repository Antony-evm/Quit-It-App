import React from 'react';
import { StyleProp, Animated, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import {
  AppPressable,
  AppIcon,
  Box,
  BOX_VARIANTS,
} from '@/shared/components/ui';
import { COLOR_PALETTE } from '@/shared/theme';
import { FabGradient } from './FabGradient';
import { useFabAnimation } from './useFabAnimation';
import AccountIcon from '@/assets/account.svg';
import HomeIcon from '@/assets/home.svg';
import ClipboardIcon from '@/assets/clipboard.svg';
import PlusIcon from '@/assets/plus.svg';

export type HomeFooterTab = 'account' | 'home' | 'journal' | 'placeholder';

export const FOOTER_TABS = {
  ACCOUNT: 'account' as HomeFooterTab,
  HOME: 'home' as HomeFooterTab,
  JOURNAL: 'journal' as HomeFooterTab,
  PLACEHOLDER: 'placeholder' as HomeFooterTab,
};

const PlaceholderIcon = (_props: SvgProps) => <Box variant="placeholderIcon" />;

const TAB_ICONS: Record<HomeFooterTab, React.FC<SvgProps>> = {
  account: AccountIcon,
  home: HomeIcon,
  journal: ClipboardIcon,
  placeholder: PlaceholderIcon,
};

type HomeFooterNavigatorProps = {
  activeTab: HomeFooterTab;
  onTabChange?: (tab: HomeFooterTab) => void;
  onFabPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const HomeFooterNavigator = ({
  activeTab,
  onTabChange,
  onFabPress,
  style,
}: HomeFooterNavigatorProps) => {
  const { scaleAnim, opacityAnim, handleFabPressIn, handleFabPressOut } =
    useFabAnimation();

  const renderTab = (
    tabKey: HomeFooterTab,
    showBorderRight: boolean = false,
  ) => {
    if (tabKey === FOOTER_TABS.PLACEHOLDER) {
      return <Box key={tabKey} variant="placeholderTab" />;
    }

    const isActive = tabKey === activeTab;
    const Icon = TAB_ICONS[tabKey];

    return (
      <AppPressable
        key={tabKey}
        variant="tab"
        separator={showBorderRight}
        android_ripple={{ color: COLOR_PALETTE.accentMuted }}
        onPress={() => {
          if (tabKey !== activeTab) {
            onTabChange?.(tabKey);
          }
        }}
      >
        <AppIcon
          icon={Icon}
          variant="inverse"
          fillOpacity={isActive ? 1 : 0.5}
        />
      </AppPressable>
    );
  };

  return (
    <Box variant="footerMain" style={style}>
      <Box variant="footerBackground">
        {renderTab(FOOTER_TABS.ACCOUNT, true)}
        {renderTab(FOOTER_TABS.HOME, false)}
        <Box variant="fabPlaceholder" />

        {renderTab(FOOTER_TABS.JOURNAL, true)}
        {renderTab(FOOTER_TABS.PLACEHOLDER, false)}
      </Box>

      <Box variant="fabContainer">
        <AppPressable
          onPress={onFabPress}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          interaction="none"
        >
          <Animated.View
            style={[
              BOX_VARIANTS.fab,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <Box variant="fabGradient">
              <FabGradient />
            </Box>
            <AppIcon icon={PlusIcon} variant="fab" />
          </Animated.View>
        </AppPressable>
      </Box>
    </Box>
  );
};
