# API Endpoints Documentation

This document details all API endpoints used in the application, their usage, caching mechanisms, and invocation timing.

## Shared

| Endpoint                | Method | Usage               | Cache                                                                            | Called When                                         |
| :---------------------- | :----- | :------------------ | :------------------------------------------------------------------------------- | :-------------------------------------------------- |
| `/api/v1/auth/types`    | GET    | `UserTypeService`   | **AsyncStorage + In-memory**<br>Persisted indefinitely, refreshed in background. | App initialization (`UserTypeService.initialize`)   |
| `/api/v1/auth/statuses` | GET    | `UserStatusService` | **AsyncStorage + In-memory**<br>Persisted indefinitely, refreshed in background. | App initialization (`UserStatusService.initialize`) |

## Auth Feature

| Endpoint                    | Method | Usage                       | Cache    | Called When                 |
| :-------------------------- | :----- | :-------------------------- | :------- | :-------------------------- |
| `/api/v1/auth?user_id={id}` | GET    | `useAuthMutations` (Login)  | **None** | User performs login action  |
| `/api/v1/auth/create`       | POST   | `useAuthMutations` (Signup) | **None** | User performs signup action |

## Questionnaire Feature

| Endpoint                          | Method | Usage                          | Cache                                                               | Called When                                |
| :-------------------------------- | :----- | :----------------------------- | :------------------------------------------------------------------ | :----------------------------------------- |
| `/api/v1/questionnaire/answers`   | POST   | `useQuestionnaire`             | **None**                                                            | User submits an answer to a question       |
| `/api/v1/questionnaire/triggers`  | GET    | `TriggersService`              | **AsyncStorage + In-memory**<br>24-hour expiry, background refresh. | Service initialization or explicit refresh |
| `/api/v1/questionnaire/plan`      | GET    | `QuittingPlanService`          | **AsyncStorage + In-memory**<br>24-hour expiry, background refresh. | Service initialization or explicit refresh |
| `/api/v1/questionnaire/plan`      | POST   | `QuittingPlanService`          | **None**                                                            | Generating a new quitting plan             |
| `/api/v1/questionnaire/account`   | GET    | `QuestionnaireAccountProvider` | **None** (Managed by React State)                                   | Provider component mounts                  |
| `/api/v1/questionnaire`           | GET    | `useQuestionnaire`             | **None**                                                            | Fetching the next question in the sequence |
| `/api/v1/questionnaire/frequency` | GET    | `FrequencyService`             | **AsyncStorage + In-memory**<br>24-hour expiry, background refresh. | Service initialization or explicit refresh |
| `/api/v1/questionnaire/complete`  | POST   | `useQuestionnaire`             | **None**                                                            | User completes the entire questionnaire    |

## Paywall Feature

| Endpoint               | Method | Usage           | Cache    | Called When                                |
| :--------------------- | :----- | :-------------- | :------- | :----------------------------------------- |
| `/api/v1/subscription` | POST   | `PaywallScreen` | **None** | User successfully purchases a subscription |

## Tracking Feature

| Endpoint                              | Method | Usage                        | Cache                                                          | Called When                                  |
| :------------------------------------ | :----- | :--------------------------- | :------------------------------------------------------------- | :------------------------------------------- |
| `/api/v1/tracking/types`              | GET    | `useTrackingTypes`           | **React Query**<br>`staleTime: Infinity`<br>`gcTime: Infinity` | Component mount (only if not already cached) |
| `/api/v1/tracking`                    | GET    | `useInfiniteTrackingRecords` | **React Query**<br>`staleTime: Infinity`<br>`gcTime: 5 mins`   | Component mount, infinite scroll pagination  |
| `/api/v1/tracking`                    | POST   | `createTrackingRecord`       | **React Query**<br>Optimistic updates applied to cache         | User creates a new tracking record           |
| `/api/v1/tracking/{recordId}`         | PATCH  | `updateTrackingRecord`       | **React Query**<br>Optimistic updates applied to cache         | User updates an existing tracking record     |
| `/api/v1/tracking/{recordId}`         | DELETE | `deleteTrackingRecord`       | **React Query**<br>Optimistic updates applied to cache         | User deletes a tracking record               |
| `/api/v1/tracking/smokes/analytics`   | GET    | `useSmokingAnalytics`        | **React Query**<br>`staleTime: 5 mins`                         | Component mount or explicit refetch          |
| `/api/v1/tracking/cravings/analytics` | GET    | `useCravingAnalytics`        | **React Query**<br>`staleTime: 5 mins`                         | Component mount or explicit refetch          |
