/**
 * Форматирует время сообщения в формат ЧЧ:ММ
 * @param {Date} date - Дата сообщения
 * @returns {string} Отформатированное время в формате ЧЧ:ММ
 * @example
 * // Возвращает "14:05"
 * formatMessageTime(new Date('2024-03-20T14:05:00'))
 */
export const formatMessageTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};