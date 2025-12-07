// 최근 검색어 관리 유틸리티

const RECENT_SEARCHES_KEY = 'recent-searches';
const MAX_RECENT_SEARCHES = 10;

// 최근 검색어 조회
export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load recent searches:', error);
    return [];
  }
}

// 최근 검색어 추가
export function addRecentSearch(searchTerm: string): void {
  if (!searchTerm.trim()) return;

  try {
    const searches = getRecentSearches();

    // 중복 제거 (이미 있으면 맨 앞으로)
    const filtered = searches.filter((term) => term !== searchTerm.trim());

    // 맨 앞에 추가
    const updated = [searchTerm.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent search:', error);
  }
}

// 특정 검색어 삭제
export function removeRecentSearch(searchTerm: string): void {
  try {
    const searches = getRecentSearches();
    const updated = searches.filter((term) => term !== searchTerm);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove recent search:', error);
  }
}

// 전체 검색어 삭제
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.error('Failed to clear recent searches:', error);
  }
}
