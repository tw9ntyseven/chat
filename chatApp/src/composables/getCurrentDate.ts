/**
 * Возвращает текущую дату в формате "день месяц год" на русском языке
 * @returns {string} Отформатированная дата
 * @example
 * // Возвращает "20 июня 2025"
 * getCurrentDate()
 */
export const getCurrentDate = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return now.toLocaleDateString('ru-RU', options);
};