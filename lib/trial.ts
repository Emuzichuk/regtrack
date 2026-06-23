// lib/trial.ts
// Trial period utilities

export const TRIAL_DAYS = 7

export function getTrialDaysLeft(trialStartedAt: string | null): number {
  if (!trialStartedAt) return TRIAL_DAYS
  const start = new Date(trialStartedAt)
  const now = new Date()
  const daysUsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, TRIAL_DAYS - daysUsed)
}

export function isTrialExpired(trialStartedAt: string | null, plan: string, planStatus: string): boolean {
  // If they have an active paid plan, not expired
  if (plan !== 'none' && planStatus === 'active') return false
  // If no trial started, not expired
  if (!trialStartedAt) return false
  return getTrialDaysLeft(trialStartedAt) === 0
}

export function isTrialActive(trialStartedAt: string | null, plan: string, planStatus: string): boolean {
  if (plan !== 'none' && planStatus === 'active') return false
  if (!trialStartedAt) return true // new user, trial not started yet
  return getTrialDaysLeft(trialStartedAt) > 0
}
