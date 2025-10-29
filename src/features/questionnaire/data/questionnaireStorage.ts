import type {
  QuestionnaireResponseRecord,
} from '../types';

type StoredRecord = QuestionnaireResponseRecord & { createdAt: number };

const cloneRecord = (record: QuestionnaireResponseRecord): QuestionnaireResponseRecord => ({
  questionId: record.questionId,
  question: record.question,
  answerType: record.answerType,
  answerHandling: record.answerHandling,
  answerOptions: record.answerOptions.map((option) => ({
    answer_option_id: option.answer_option_id,
    answer_value: option.answer_value,
    answer_type: option.answer_type,
  })),
});

const cloneStoredRecord = (record: StoredRecord): StoredRecord => ({
  ...cloneRecord(record),
  createdAt: record.createdAt,
});

let records: StoredRecord[] = [];

const resolveAll = (): QuestionnaireResponseRecord[] =>
  records
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .map(cloneRecord);

export const questionnaireStorage = {
  all: async (): Promise<QuestionnaireResponseRecord[]> => {
    return resolveAll();
  },
  append: async (record: QuestionnaireResponseRecord): Promise<void> => {
    await questionnaireStorage.save(record);
  },
  save: async (record: QuestionnaireResponseRecord): Promise<void> => {
    const existingIndex = records.findIndex(
      (entry) => entry.questionId === record.questionId,
    );
    const next = cloneStoredRecord({ ...record, createdAt: Date.now() });

    if (existingIndex >= 0) {
      records[existingIndex] = { ...next, createdAt: records[existingIndex].createdAt };
      return;
    }

    records = [...records, next];
  },
  removeByQuestionId: async (questionId: number): Promise<void> => {
    records = records.filter((entry) => entry.questionId !== questionId);
  },
  clear: async (): Promise<void> => {
    records = [];
  },
};
