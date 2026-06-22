const PREFIX = 'campus_market_'

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      console.error('Failed to save to localStorage')
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },
}
