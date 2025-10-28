import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { QuestionnaireResponseModel } from './models/QuestionnaireResponse';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('Failed to set up WatermelonDB adapter', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [QuestionnaireResponseModel],
});

export const QUESTIONNAIRE_RESPONSES_TABLE = 'questionnaire_responses';
