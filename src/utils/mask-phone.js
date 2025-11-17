export function maskPhoneNumber(phoneNumber) {
  // Check if the phone number is at least 5 characters long
  if (phoneNumber.length < 5) {
    return phoneNumber; // Return the original string if it's too short to mask
  }

  // Extract the first three and last two characters
  const firstThree = phoneNumber.substring(0, 3);
  const lastTwo = phoneNumber.substring(phoneNumber.length - 2);

  // Create a string of asterisks with a length of phoneNumber.length - 5
  const middleAsterisks = '*'.repeat(phoneNumber.length - 5);

  // Combine the masked phone number
  const maskedPhoneNumber = `${firstThree}${middleAsterisks}${lastTwo}`;

  return maskedPhoneNumber;
}