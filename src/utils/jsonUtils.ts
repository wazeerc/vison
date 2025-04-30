
/**
 * Utility functions for handling JSON in Vison
 */

/**
 * Attempts to parse a JSON string
 * @param jsonString The JSON string to parse
 * @returns Object containing parsed result or error message
 */
export const parseJson = (jsonString: string): { 
  data: Record<string, any> | null; 
  error: string | null;
  isArray: boolean;
} => {
  try {
    if (!jsonString.trim()) {
      return { data: null, error: null, isArray: false };
    }

    const parsed = JSON.parse(jsonString);
    const isArray = Array.isArray(parsed);
    
    return {
      data: parsed,
      error: null,
      isArray
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      isArray: false
    };
  }
};

/**
 * Formats JSON for display with proper indentation
 * @param json The JSON object to format
 * @returns Formatted JSON string
 */
export const formatJson = (json: Record<string, any> | null): string => {
  if (json === null) return '';
  
  return JSON.stringify(json, null, 2);
};

/**
 * Flattens a nested JSON object for table display
 * @param jsonData The JSON data to flatten
 * @returns Array of flattened objects
 */
export const flattenJson = (jsonData: Record<string, any> | any[]): any[] => {
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  
  return [jsonData];
};

/**
 * Gets all unique keys from an array of objects
 * @param objects Array of objects to extract keys from
 * @returns Array of unique keys
 */
export const getUniqueKeys = (objects: Record<string, any>[]): string[] => {
  const keySet = new Set<string>();
  
  objects.forEach(obj => {
    Object.keys(obj).forEach(key => keySet.add(key));
  });
  
  return Array.from(keySet);
};

/**
 * Updates a value in a JSON object
 * @param jsonData Original JSON data
 * @param index Row index to update (for array data)
 * @param key Property key to update
 * @param value New value
 * @returns Updated JSON data
 */
export const updateJsonValue = (
  jsonData: Record<string, any> | any[], 
  index: number, 
  key: string, 
  value: any
): Record<string, any> | any[] => {
  if (Array.isArray(jsonData)) {
    const newData = [...jsonData];
    newData[index] = { ...newData[index], [key]: value };
    return newData;
  } else {
    return { ...jsonData, [key]: value };
  }
};

/**
 * Determines if a value should be editable in the table
 * @param value The value to check
 * @returns Boolean indicating if the value is editable
 */
export const isEditableValue = (value: any): boolean => {
  const type = typeof value;
  return value === null || ['string', 'number', 'boolean'].includes(type);
};

/**
 * Convert string to proper type
 * @param value String value
 * @returns Converted value
 */
export const convertValueType = (value: string): any => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value === '') return '';
  
  // Check if it's a number
  const num = Number(value);
  if (!isNaN(num)) return num;
  
  return value;
};
