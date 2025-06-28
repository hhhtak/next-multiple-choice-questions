/**
 * 配列をシャッフルする関数
 * Fisher-Yates アルゴリズムを使用
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 配列から重複を除去する関数（IDを基準）
 */
export function removeDuplicatesById<T extends { id: number }>(array: T[]): T[] {
  return array.filter(
    (item, index, self) => index === self.findIndex((q) => q.id === item.id)
  );
}
