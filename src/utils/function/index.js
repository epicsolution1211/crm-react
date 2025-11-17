
export const isDateTime = (value) => {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  return pattern.test(value) && !isNaN(Date.parse(value));
};

export const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export function isDate(str) {
  // Try creating a Date object from the string
  const dateObject = new Date(str);

  // Check if the Date object is valid and the string is not 'Invalid Date'
  return !isNaN(dateObject.getTime()) && dateObject.toString() !== 'Invalid Date';
}

export const  hasFilter = (obj) => {
  return Object.values(obj).some(value => {
    return value !== null && value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  });
}
export const hasCustomFilter = (obj) => {
  return obj?.some(item => {
    return item?.filter !== null && (
      (item?.filter?.field_type === "text" && item?.filter?.query) ||
      (item?.filter?.field_type === "multi_choice_radio" && (item?.filter?.non_query?.length > 0 || item?.filter?.query?.length > 0)) ||
      (item?.filter?.field_type === "multi_choice" && (item?.filter?.non_query?.length > 0 || item?.filter?.query?.length > 0)) ||
      (item?.filter?.field_type === "boolean" && item?.filter?.query) ||
      (item?.filter?.field_type === "number" && (item?.filter?.query?.gt || item?.filter?.query?.lt))
    )
  });
}

export const isValidJSON = (str) => {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
}
