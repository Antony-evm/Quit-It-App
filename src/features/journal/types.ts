import type { RefObject } from 'react';
import type { ScrollView } from 'react-native';

export type TrackingTypeOption = {
  id: number;
  displayName: string;
  is_default?: boolean;
};

export type NotesCardFormState = {
  selectedTrackingTypeId: number | null;
  selectedDateTime: Date;
  notes: string;
};

export type NotesCardFormData = {
  trackingTypeId: number;
  dateTime: Date;
  notes: string;
};

export type NotesCardInitialValues = {
  trackingTypeId: number;
  dateTime: Date;
  notes: string;
};

export type NotesCardHandle = {
  save: () => void;
  delete: () => void;
};

// Props for the dumb UI component
export type NotesCardProps = {
  // Data
  trackingTypes: TrackingTypeOption[];
  selectedTrackingTypeId: number | null;
  selectedDateTime: Date;
  notes: string;
  maxChars: number;
  accentColor: string;
  isLoading?: boolean;

  // Event handlers
  onTrackingTypeSelect: (id: number) => void;
  onDateTimeChange: (date: Date) => void;
  onNotesChange: (text: string) => void;
  onNotesFocus?: () => void;

  // Scroll ref for keyboard handling
  scrollViewRef?: RefObject<ScrollView | null>;
};

// Props for the controller hook
export type UseNotesCardControllerOptions = {
  userId?: number;
  recordId?: number;
  initialValues?: NotesCardInitialValues;
  onSave?: (data: NotesCardFormData) => void;
  onSaveSuccess?: () => void;
  onDeleteSuccess?: () => void;
  scrollViewRef?: RefObject<ScrollView | null>;
};
