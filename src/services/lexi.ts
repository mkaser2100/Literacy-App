export type Attempt = {
  sessionId: string;
  activityId: string;
  activityType: string;
  skillId: string;
  contentId: string;
  presentedAt: string;
  answeredAt: string;
  response: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  hintUsed: boolean;
  attemptNumber: number;
  difficulty: number;
};

export type Session = {
  id: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  itemCount?: number;
  correctCount?: number;
  accuracy?: number;
  stars?: number;
  xp?: number;
};

const ATTEMPTS_KEY = 'lexi_phase2_attempts';
const SESSIONS_KEY = 'lexi_phase2_sessions';

const read = <T,>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const write = <T,>(key: string, rows: T[]) => localStorage.setItem(key, JSON.stringify(rows));

export function startSession(): Session {
  const session = { id: crypto.randomUUID(), startedAt: new Date().toISOString() };
  write(SESSIONS_KEY, [...read<Session>(SESSIONS_KEY), session]);
  return session;
}

export function saveAttempt(attempt: Attempt) {
  write(ATTEMPTS_KEY, [...read<Attempt>(ATTEMPTS_KEY), attempt]);
}

export function finishSession(id: string, summary: Omit<Session, 'id' | 'startedAt'>) {
  const sessions = read<Session>(SESSIONS_KEY);
  const updated = sessions.map(s => s.id === id ? { ...s, ...summary } : s);
  write(SESSIONS_KEY, updated);
}

export const getAttempts = () => read<Attempt>(ATTEMPTS_KEY);
export const getSessions = () => read<Session>(SESSIONS_KEY).sort((a,b) => b.startedAt.localeCompare(a.startedAt));
export const getSessionAttempts = (id: string) => getAttempts().filter(a => a.sessionId === id);

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.78;
  speechSynthesis.speak(utterance);
}
