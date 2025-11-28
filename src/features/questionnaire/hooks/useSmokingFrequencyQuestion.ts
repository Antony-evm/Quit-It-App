import { useState, useEffect } from 'react';
import { fetchQuestion } from '../api/fetchQuestion';
import { SMOKING_FREQUENCY_QUESTION_CODE } from '../constants';
import type { Question } from '../types';

let cachedQuestion: Question | null = null;
let loadingPromise: Promise<Question | null> | null = null;
let errorState: string | null = null;

export const useSmokingFrequencyQuestion = () => {
  const [question, setQuestion] = useState<Question | null>(cachedQuestion);
  const [isLoading, setIsLoading] = useState(!cachedQuestion && !errorState);
  const [error, setError] = useState<string | null>(errorState);

  useEffect(() => {
    if (cachedQuestion) {
      setQuestion(cachedQuestion);
      setIsLoading(false);
      return;
    }

    if (errorState) {
      setError(errorState);
      setIsLoading(false);
      return;
    }

    if (!loadingPromise) {
      loadingPromise = fetchQuestion({
        questionCode: SMOKING_FREQUENCY_QUESTION_CODE,
      })
        .then(data => {
          cachedQuestion = data;
          return data;
        })
        .catch(err => {
          errorState =
            err instanceof Error ? err.message : 'Failed to load question';
          throw err;
        });
    }

    let isMounted = true;

    loadingPromise
      .then(data => {
        if (isMounted) {
          setQuestion(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load question',
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { question, isLoading, error };
};
