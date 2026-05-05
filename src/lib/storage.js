const STORAGE_KEYS = {
  API_KEY: 'ai-job-checker-api-key',
  JD_RESULTS: 'ai-job-checker-jd-results',
  EXPERIENCE_RESULTS: 'ai-job-checker-experience-results',
  INTERVIEW_SESSIONS: 'ai-job-checker-interview-sessions',
  ARCHIVE: 'ai-job-checker-archive',
};

export function getApiKey() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
}

export function setApiKey(key) {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

export function clearApiKey() {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
}

export function saveArchiveItem(item) {
  const archives = getArchives();
  archives.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('zh-CN'),
    ...item,
  });
  localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(archives.slice(0, 50)));
  return archives;
}

export function getArchives() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ARCHIVE);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveJdResult(result) {
  localStorage.setItem(STORAGE_KEYS.JD_RESULTS, JSON.stringify(result));
}

export function getJdResult() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JD_RESULTS);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveExperienceResult(result) {
  localStorage.setItem(STORAGE_KEYS.EXPERIENCE_RESULTS, JSON.stringify(result));
}

export function getExperienceResult() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPERIENCE_RESULTS);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key !== STORAGE_KEYS.API_KEY) {
      localStorage.removeItem(key);
    }
  });
}
