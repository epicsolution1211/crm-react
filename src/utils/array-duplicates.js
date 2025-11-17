export function haveDuplicates(arr1, arr2) {
  // Create a set to store unique names
  const uniqueNames = new Set();

  // Iterate over the first array and add the names to the set
  for (const obj of arr1) {
    uniqueNames.add(obj.name);
  }

  // Iterate over the second array and check if any names are already in the set
  for (const obj of arr2) {
    if (uniqueNames.has(obj.name)) {
      return true; // Found a duplicate
    }
  }

  // No duplicates found
  return false;
}