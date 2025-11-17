export function isAudioFile(filename) {
  // Define a list of valid audio file extensions
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'];

  // Extract the file extension from the filename
  const extension = filename.split('.').pop().toLowerCase();

  // Check if the extension exists in the list
  return audioExtensions.includes(extension);
}