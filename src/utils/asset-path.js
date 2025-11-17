export const getAssetPath = (path) => {
  if (!path) return path;
  
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return `.${path}`;
  }
  return path;
};

export const getAssetPathFromSrc = (src) => {
  if (!src) return src;
  
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    if (src.startsWith('/assets/')) {
      return `.${src}`;
    }
  }
  return src;
};