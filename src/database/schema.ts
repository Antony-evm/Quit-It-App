import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const SCHEMA_VERSION = 1;

export const schema = appSchema({
  version: SCHEMA_VERSION,
  tables: [
    tableSchema({
      name: 'questionnaire_responses',
      columns: [
        { name: 'question_id', type: 'number' },
        { name: 'question', type: 'string' },
        { name: 'answer_type', type: 'string' },
        { name: 'answer_handling', type: 'string' },
        { name: 'answer_options', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});

export type DatabaseTableName = 'questionnaire_responses';
