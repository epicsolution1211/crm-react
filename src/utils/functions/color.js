export const generateAvatarColors = (name) => {
  // Generate unique hash from name
  const hash = name?.split('')
    .map((char, index) => {
      const charCode = char.charCodeAt(0);
      const position = index + 1;
      const prime = 31;
      return charCode * position * prime;
    })
    .reduce((acc, val) => acc + val, 0);

  // Generate pastel colors
  const hue = (hash * 137) % 360;
  const saturation = 65 + (hash % 15); // 65-80% saturation for softer colors
  const lightness = 70 + (hash % 10); // 75-85% lightness for pastel shades
  const textLightness = 25; // Darker text for better contrast

  // Simple solid background color
  const bgcolor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Dark text color that contrasts well
  const color = `hsl(${hue}, ${saturation}%, ${textLightness}%)`;

  return { bgcolor, color };
}