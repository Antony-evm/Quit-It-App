export type QuestionnaireOptionType = 'single' | 'multiple' | 'freeText' | 'unknown';

export interface QuestionnaireOption {
  id: string;
  label: string;
  value: string;
  isDefault?: boolean;
}

export interface QuestionnaireQuestion {
  id: string;
  prompt: string;
  description?: string;
  type?: QuestionnaireOptionType;
  options?: QuestionnaireOption[];
}

export interface QuestionnairePayload {
  id: string;
  title: string;
  subtitle?: string;
  questions: QuestionnaireQuestion[];
}
