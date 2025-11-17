export function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Check if the date object is valid
}