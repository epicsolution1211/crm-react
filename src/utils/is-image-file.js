export function isImageFilename(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg']; // Add more extensions if needed
  
  const fileExtension = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  
  return imageExtensions.includes(fileExtension);
}
