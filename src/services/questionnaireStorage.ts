import type {
  AnswerHandling,
  AnswerType,
  QuestionnaireResponseRecord,
} from '../types/questionnaire';
import { database, QUESTIONNAIRE_RESPONSES_TABLE } from '../database';
import { QuestionnaireResponseModel } from '../database/models/QuestionnaireResponse';

const responsesCollection =
  database.collections.get<QuestionnaireResponseModel>(
    QUESTIONNAIRE_RESPONSES_TABLE,
  );

const parseAnswerOptions = (
  model: QuestionnaireResponseModel,
): QuestionnaireResponseRecord['answerOptions'] => {
  const fallback: QuestionnaireResponseRecord['answerOptions'] = [];
  return model.getAnswerOptions(fallback);
};

const mapModelToRecord = (
  model: QuestionnaireResponseModel,
): QuestionnaireResponseRecord => ({
  questionId: model.questionId,
  question: model.question,
  answerType: model.answerType as AnswerType,
  answerHandling: model.answerHandling as AnswerHandling,
  answerOptions: parseAnswerOptions(model),
});

export const questionnaireStorage = {
  all: async (): Promise<QuestionnaireResponseRecord[]> => {
    const models = await responsesCollection.query().fetch();
    const sorted = models.sort((a, b) => a.createdAt - b.createdAt);
    return sorted.map(mapModelToRecord);
  },
  append: async (record: QuestionnaireResponseRecord): Promise<void> => {
    await database.write(async () => {
      await responsesCollection.create((entry) => {
        entry.questionId = record.questionId;
        entry.question = record.question;
        entry.answerType = record.answerType;
        entry.answerHandling = record.answerHandling;
        entry.answerOptionsRaw = JSON.stringify(record.answerOptions ?? []);
        entry.createdAt = Date.now();
      });
    });
  },
  clear: async (): Promise<void> => {
    await database.write(async () => {
      const existing = await responsesCollection.query().fetch();
      if (!existing.length) {
        return;
      }
      await database.batch(
        ...existing.map((entry) => entry.prepareDestroyPermanently()),
      );
    });
  },
};
