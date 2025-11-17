export function deepCompare(obj1, obj2) {
  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if they have the same number of keys
  if (keys1.length !== keys2.length) {
      return false;
  }

  // Check each key-value pair recursively
  for (let key of keys1) {
      // Check if the key exists in obj2 and compare values
      if (!(key in obj2) || obj1[key] !== obj2[key]) {
          return false;
      }
  }

  // All checks passed, objects are deeply equal
  return true;
}