import type { UserDataResponse } from '@/shared/types/api';

export type PlanStatus = 'Cut Down' | 'Quit It';

export interface QuittingPlanResponse {
  date: string;
  status: PlanStatus;
  current: number;
  target: number;
  text: string;
}

export interface QuittingPlan {
  date: Date;
  status: PlanStatus;
  current: number;
  target: number;
  text: string;
}

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

export interface AnswerSubOptionRecord {
  value: string;
  combination: string;
}

export interface QuestionResponse {
  question_id: number;
  code: string;
  order_id: number;
  variation_id: number;
  question: string;
  explanation: string;
  answer_type: string;
  answer_handling: string;
  default_value?: string | null;
  sub_answer_type?: string | null;
  sub_answer_handling?: string | null;
  sub_default_value?: string | null;
  sub_combination?: string | null;
  answer_units?: string | null;
  max_question: number;
  options: Record<number, AnswerOptionRecord>;
  sub_options: Record<number, AnswerSubOptionRecord>;
}

export interface AnswerOption {
  id: number;
  label: string;
  value: string;
  nextVariationId: number;
  defaultValue: number | null;
}

export interface AnswerSubOption {
  id: number;
  label: string;
  value: string;
  combination: string;
}

export interface Question {
  id: number;
  questionCode: string;
  orderId: number;
  variationId: number;
  prompt: string;
  explanation: string;
  answerType: AnswerType;
  answerHandling: AnswerHandling;
  options: AnswerOption[];
  defaultValue: number | null;
  subAnswerType?: AnswerType | null;
  subAnswerHandling?: AnswerHandling | null;
  subOptions: AnswerSubOption[];
  subDefaultValue?: number | null;
  subCombination?: string | null;
  units?: string | null;
  maxQuestion: number;
}

export interface QuestionnaireAnswerOptionPayload {
  answer_option_id: number;
  answer_value: string;
  answer_type: AnswerType;
}

export interface QuestionnaireAnswerSubOptionPayload {
  answer_sub_option_id: number;
  answer_value: string;
  answer_type: AnswerType;
}

export interface AnswerOptionsPair {
  answer_option_id: number;
  answer_value: string;
  answer_type: AnswerType;
  answer_sub_option_id: number | null;
  answer_sub_option_value: string | null;
  answer_sub_option_type: AnswerType | null;
}

export interface QuestionnaireAnswerPayload {
  user_id: number;
  question_id: number;
  question_code: string;
  question_order_id: number;
  question_variation_id: number;
  question: string;
  answer_options: AnswerOptionsPair[];
}

export interface QuestionnaireResponseRecord {
  questionId: number;
  questionCode: string;
  questionOrderId: number;
  questionVariationId: number;
  question: string;
  answerType: AnswerType;
  answerHandling: AnswerHandling;
  answerOptions: AnswerOptionsPair[];
  subAnswerType?: AnswerType | null;
  subAnswerHandling?: AnswerHandling | null;
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

export interface SelectedAnswerSubOption {
  optionId: number;
  value: string;
  answerType: AnswerType;
  combination: string;
  mainOptionId?: number;
}

export interface QuestionnaireCompleteResponse extends UserDataResponse {}
