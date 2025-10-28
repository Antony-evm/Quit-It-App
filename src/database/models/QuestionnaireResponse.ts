import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class QuestionnaireResponseModel extends Model {
  static table = 'questionnaire_responses';

  @field('question_id') questionId!: number;
  @field('question') question!: string;
  @field('answer_type') answerType!: string;
  @field('answer_handling') answerHandling!: string;
  @field('answer_options') answerOptionsRaw!: string;
  @field('created_at') createdAt!: number;

  getAnswerOptions<T>(fallback: T): T {
    try {
      return JSON.parse(this.answerOptionsRaw) as T;
    } catch (error) {
      console.warn('Failed to parse stored questionnaire answer options', error);
      return fallback;
    }
  }
}

export type QuestionnaireResponseModelRecord = QuestionnaireResponseModel['_raw'];
