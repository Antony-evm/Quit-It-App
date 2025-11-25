// Example of how to use the new variant-based styling system

import { StyleSheet } from 'react-native';
import { SURFACE_VARIANTS, LAYOUT_STYLES, getSurfaceVariant, SPACING } from '@/shared/styles/commonStyles';

/\*\*

- Example component showing how to use variants
  \*/
  const ExampleStyles = StyleSheet.create({
  // Basic card with default variant
  simpleCard: {
  ...getSurfaceVariant('card'),
  },

// Interactive element (button-like)
interactiveElement: {
...getSurfaceVariant('interactive'),
marginBottom: SPACING.md,
},

// Dropdown using elevated variant + layout
dropdown: {
...getSurfaceVariant('interactive'),
...LAYOUT_STYLES.rowBetween,
},

dropdownList: {
...getSurfaceVariant('elevated'),
...LAYOUT_STYLES.dropdownList,
},

// Input field
textInput: {
...getSurfaceVariant('input'),
minHeight: 40,
},

// Custom variant override
customCard: {
...getSurfaceVariant('card'),
backgroundColor: '#custom-color', // Override specific properties
padding: SPACING.xl, // Override padding
},
});

/\*\*

- Benefits of this approach:
- 1.  Easy to change all cards by updating the 'card' variant
- 2.  Consistent styling across components
- 3.  Flexible - can override specific properties when needed
- 4.  Composable - can combine variants with layout styles
- 5.  Type-safe with TypeScript
      \*/
