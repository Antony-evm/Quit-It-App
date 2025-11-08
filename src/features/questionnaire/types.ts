export type AnswerType =
  | 'multiple_choice'
  | 'numeric'
  | 'time'
  | 'date'
  | 'unknown';

export type AnswerHandling = 'single' | 'all' | 'range' | 'max' | 'unknown';

export interface AnswerOptionRecord {
  value: string;
  next_question_variation_id: number;
  default_value?: string | null;
}

export interface QuestionResponse {
  question_id: number;
  order_id: number;
  variation_id: number;
  question: string;
  explanation: string;
  answer_type: string;
  answer_handling: string;
  default_value?: string | null;
  options: Record<number, AnswerOptionRecord>;
}

export interface AnswerOption {
  id: number;
  label: string;
  value: string;
  nextVariationId: number;
  defaultValue: number | null;
}

export interface Question {
  id: number;
  orderId: number;
  variationId: number;
  prompt: string;
  explanation: string;
  answerType: AnswerType;
  answerHandling: AnswerHandling;
  options: AnswerOption[];
  defaultValue: number | null;
}

export interface QuestionnaireAnswerOptionPayload {
  answer_option_id: number;
  answer_value: string;
  answer_type: AnswerType;
}

export interface QuestionnaireAnswerPayload {
  user_id: number;
  question_id: number;
  question: string;
  answer_options: QuestionnaireAnswerOptionPayload[];
}

export interface QuestionnaireBatchAnswerPayload {
  user_id: number;
  answers: QuestionnaireAnswerPayload[];
}

export interface QuestionnaireResponseRecord {
  questionId: number;
  question: string;
  answerType: AnswerType;
  answerHandling: AnswerHandling;
  answerOptions: QuestionnaireAnswerOptionPayload[];
}

export interface QuestionnaireProgress {
  currentQuestion: Question | null;
  currentOrderId: number;
  currentVariationId: number;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  isReviewing: boolean;
  history: QuestionnaireResponseRecord[];
}

export interface SelectedAnswerOption {
  optionId: number;
  value: string;
  answerType: AnswerType;
  nextVariationId: number;
}
