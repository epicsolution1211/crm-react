export function convertArrayToJSON(inputArray) {
  // Create an empty object to store the result
  let result = {};

  // Loop through the input array and transform each object
  inputArray.forEach((item, index) => {
    // Create a new object with the desired format
    let newItem = {
      field_id: item.field_id,
      field_type: item.field_type,
      query: item.query,
    };

    // Add the new object to the result object using the index as the key
    result[index.toString()] = newItem;
  });

  // Return the result as a JSON object
  return result;
}