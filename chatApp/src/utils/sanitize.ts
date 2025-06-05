/**
 * Санитизирует текст, удаляя потенциально опасные элементы
 * @param text Исходный текст
 * @returns Безопасный текст
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    // Экранируем HTML-теги
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Экранируем кавычки
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    // Удаляем потенциально опасные Unicode-символы
    .replace(/[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/g, '')
    // Удаляем возможные XSS-инъекции
    .replace(/(javascript|data|vbscript):/gi, '')
    // Ограничиваем длину сообщения
    .slice(0, 1000);
}

/**
 * Проверяет текст на наличие спама или нежелательного контента
 * @param text Текст для проверки
 * @returns true если текст содержит спам
 */
export function isSpam(text: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|prize|winner)\b/i,
    /\b(http|https|www\.)\b/i,
    /\b([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\b/,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
  ];

  return spamPatterns.some(pattern => pattern.test(text));
} 