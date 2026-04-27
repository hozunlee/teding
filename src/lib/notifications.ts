export async function requestNotificationPermission(): Promise<boolean> {
  return false
}

export async function scheduleDailyStudyReminder(): Promise<void> {
  return
}

export async function cancelDailyStudyReminder(): Promise<void> {
  return
}

export async function getDailyStudyReminder() {
  return null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function setupNotificationHandler(navigate: (path: string) => void): Promise<void> {
  return
}
