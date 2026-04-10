export function scheduleAiFallbackJob(questionId) {
  return {
    questionId,
    delayMinutes: 15,
    condition: "Trigger only if answersCount === 0 when the job runs."
  };
}
