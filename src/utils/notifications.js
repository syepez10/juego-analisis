const NOTIF_KEY = 'neurotests-notif-state';

function getState() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY)) || {};
  } catch { return {}; }
}

function setState(patch) {
  const s = { ...getState(), ...patch };
  localStorage.setItem(NOTIF_KEY, JSON.stringify(s));
  return s;
}

/** Check if notifications are supported and permitted */
export function canNotify() {
  return 'Notification' in window && Notification.permission === 'granted';
}

/** Request notification permission — call after user interaction */
export async function requestPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Check if we should ask for permission (after 3+ tests, max 1 ask per session) */
export function shouldAskPermission(testsCompleted) {
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'default') return false;
  if (testsCompleted < 3) return false;
  const state = getState();
  const today = new Date().toDateString();
  if (state.lastAskDate === today) return false;
  return true;
}

/** Mark that we asked today */
export function markAsked() {
  setState({ lastAskDate: new Date().toDateString() });
}

/**
 * Schedule a streak reminder via service worker.
 * Fires at 20:00 local time if the user hasn't done their daily test.
 */
export function scheduleStreakReminder(streak, dailyDone) {
  if (!canNotify() || dailyDone) return;
  if (!navigator.serviceWorker?.controller) return;

  const state = getState();
  const today = new Date().toDateString();
  if (state.reminderScheduledDate === today) return; // already scheduled today

  const now = new Date();
  const reminderHour = 20; // 8 PM
  const target = new Date(now);
  target.setHours(reminderHour, 0, 0, 0);

  // Only schedule if it's before the reminder time
  if (now >= target) return;

  const delayMs = target.getTime() - now.getTime();

  navigator.serviceWorker.controller.postMessage({
    type: 'SCHEDULE_STREAK_REMINDER',
    delayMs,
    streak,
  });

  setState({ reminderScheduledDate: today });
}

/**
 * Show an immediate notification (for testing or direct triggers)
 */
export function showNotification(title, body) {
  if (!canNotify()) return;
  if (navigator.serviceWorker?.ready) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'neurotests-general',
      });
    });
  }
}
