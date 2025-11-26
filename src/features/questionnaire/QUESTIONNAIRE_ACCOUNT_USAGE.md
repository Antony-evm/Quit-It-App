// Example usage of questionnaire account data in components
//
// This demonstrates how to access the cached question IDs in any component:
//
// import { useQuestionnaireAccountData } from '@/features/questionnaire';
//
// export const SomeComponent = () => {
// const {
// questionIds,
// isLoading,
// error,
// hasQuestionId,
// refresh
// } = useQuestionnaireAccountData();
//
// // Check if a specific question ID exists
// const isValidQuestion = hasQuestionId(123);
//
// // Get all question IDs
// console.log('Available question IDs:', questionIds);
//
// // Force refresh if needed
// const handleRefresh = () => {
// refresh();
// };
//
// if (isLoading) return <LoadingComponent />;
// if (error) return <ErrorComponent error={error} />;
//
// return (
// <View>
// <Text>Question IDs: {questionIds.join(', ')}</Text>
// <Button onPress={handleRefresh} title="Refresh" />
// </View>
// );
// };
//
// The question IDs are automatically fetched and cached when:
// 1. User is authenticated
// 2. User's status indicates they should navigate to home (NAVIGATE_TO_HOME action)
// 3. The QuestionnaireAccountProvider wraps the app (done in App.tsx)
//
// The data is cached using AsyncStorage and follows the same pattern as:
// - UserStatusService for user statuses
// - UserTypeService for user types
// - TrackingTypesProvider for tracking types
