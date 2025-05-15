/**
 * Utility functions for handling JSON in Vison
 */

// Define recursive types for JSON values using type aliases
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

/**
 * Attempts to parse a JSON string
 * @param jsonString The JSON string to parse
 * @returns Object containing parsed result or error message
 */
export const parseJson = (
  jsonString: string
): {
  data: JsonValue | null; // Use JsonValue type
  error: string | null;
  isArray: boolean;
} => {
  try {
    if (!jsonString.trim()) {
      return { data: null, error: null, isArray: false };
    }

    const parsed: JsonValue = JSON.parse(jsonString);
    const isArray = Array.isArray(parsed);

    return {
      data: parsed,
      error: null,
      isArray,
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      isArray: false,
    };
  }
};

/**
 * Formats JSON for display with proper indentation
 * @param json The JSON object to format
 * @returns Formatted JSON string
 */
export const formatJson = (json: JsonValue | null): string => {
  // Use JsonValue type
  if (json === null) return '';

  return JSON.stringify(json, null, 2);
};

/**
 * Flattens a JSON object or array for table display
 * NOTE: This current implementation is basic and only suitable for arrays of objects
 * or a single object. It doesn't handle deep nesting well for the table view.
 * @param jsonData The JSON data to flatten
 * @returns Array of flattened objects (or a single object in an array)
 */
export const flattenJson = (jsonData: JsonValue): Record<string, unknown>[] => {
  if (Array.isArray(jsonData)) {
    // Ensure all elements are objects for table consistency, though this might hide non-object array elements
    return jsonData.filter(item => typeof item === 'object' && item !== null) as Record<
      string,
      unknown
    >[];
  }
  if (typeof jsonData === 'object' && jsonData !== null) {
    return [jsonData as Record<string, unknown>];
  }
  // Handle cases where the root is not an object or array (e.g., just a string or number)
  // Represent it as a single row/column table if needed, or return empty.
  // For simplicity, returning empty array if not object/array.
  return [];
};

/**
 * Gets all unique keys from an array of objects
 * @param objects Array of objects to extract keys from
 * @returns Array of unique keys
 */
export const getUniqueKeys = (objects: Record<string, unknown>[]): string[] => {
  const keySet = new Set<string>();

  objects.forEach(obj => {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => keySet.add(key));
    }
  });

  return Array.from(keySet);
};

/**
 * Updates a value in a JSON object or array (shallow update for table)
 * @param jsonData Original JSON data
 * @param index Row index to update (relevant for array data)
 * @param key Property key to update
 * @param value New value
 * @returns Updated JSON data
 */
export const updateJsonValue = (
  jsonData: JsonValue,
  index: number,
  key: string,
  value: unknown
): JsonValue => {
  // Create a deep copy to avoid modifying the original state directly
  // This is important for React state updates
  const newData = JSON.parse(JSON.stringify(jsonData));

  if (Array.isArray(newData)) {
    if (
      index >= 0 &&
      index < newData.length &&
      typeof newData[index] === 'object' &&
      newData[index] !== null
    ) {
      (newData[index] as JsonObject)[key] = value as JsonValue;
    }
    return newData;
  } else if (typeof newData === 'object' && newData !== null) {
    // If it's a single object (represented as the first row in the flattened array)
    (newData as JsonObject)[key] = value as JsonValue;
    return newData;
  }
  // Return original data if it's not an array or object (shouldn't happen with current flatten logic)
  return jsonData;
};

/**
 * Calculates the maximum depth of a JSON object or array.
 * @param value The JSON value to check.
 * @param currentDepth The current depth level.
 * @returns The maximum depth found.
 */
export const getJsonDepth = (value: JsonValue, currentDepth: number = 1): number => {
  if (typeof value !== 'object' || value === null) {
    return currentDepth;
  }

  let maxDepth = currentDepth;
  if (Array.isArray(value)) {
    for (const item of value) {
      maxDepth = Math.max(maxDepth, getJsonDepth(item, currentDepth + 1));
    }
  } else {
    // It's an object
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        maxDepth = Math.max(maxDepth, getJsonDepth(value[key], currentDepth + 1));
      }
    }
  }
  return maxDepth;
};

/**
 * Updates a value deep within a JSON object or array using a path.
 * Creates a deep copy to avoid mutating the original object.
 * @param data The original JSON data (object or array).
 * @param path An array of keys/indices representing the path to the value (excluding root).
 * @param newValue The new value to set.
 * @returns A new JSON object/array with the value updated, or the original data if path is invalid.
 */
export const updateNestedJsonValue = (
  data: JsonValue,
  path: (string | number)[],
  newValue: JsonValue
): JsonValue => {
  if (path.length === 0) {
    // If path is empty after removing 'root', it means we are updating the root itself.
    // This case might need careful handling depending on UI, but for now, just replace.
    return newValue;
  }

  // Deep copy to ensure immutability
  const newData = JSON.parse(JSON.stringify(data));
  let current: unknown = newData; // Use unknown instead of any

  try {
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      // Type guard to ensure current is an indexable type (object or array)
      if (typeof current !== 'object' || current === null) {
        console.error(
          'Invalid path segment: encountered non-object/array before end:',
          key,
          'in path:',
          path
        );
        return data;
      }

      // Check if key exists before accessing
      if (Array.isArray(current)) {
        if (typeof key !== 'number' || key < 0 || key >= current.length) {
          console.error('Invalid array index in path:', key, 'in path:', path);
          return data;
        }
        current = current[key];
      } else {
        // It's an object
        if (typeof key !== 'string' || !Object.prototype.hasOwnProperty.call(current, key)) {
          console.error('Invalid object key in path:', key, 'in path:', path);
          return data;
        }
        current = (current as JsonObject)[key];
      }
    }

    const finalKey = path[path.length - 1];
    // Final type guard
    if (typeof current !== 'object' || current === null) {
      console.error('Cannot set property on non-object/array at final step:', path);
      return data;
    }

    if (Array.isArray(current)) {
      if (typeof finalKey === 'number' && finalKey >= 0 && finalKey <= current.length) {
        // Allow inserting at the end
        current[finalKey] = newValue;
      } else {
        console.error('Invalid final array index for update:', finalKey, 'in path:', path);
        return data;
      }
    } else {
      // It's an object
      if (typeof finalKey === 'string') {
        (current as JsonObject)[finalKey] = newValue;
      } else {
        console.error('Invalid final object key for update:', finalKey, 'in path:', path);
        return data;
      }
    }

    return newData;
  } catch (error) {
    console.error('Error updating nested JSON value:', error, path, newValue);
    return data;
  }
};

/**
 * Determines if a value should be editable in the table
 * @param value The value to check
 * @returns Boolean indicating if the value is editable
 */
export const isEditableValue = (value: unknown): boolean => {
  const type = typeof value;
  return value === null || ['string', 'number', 'boolean'].includes(type);
};

/**
 * Convert string input from table cell to proper type
 * @param value String value from input
 * @returns Converted value (boolean, null, number, or string)
 */
export const convertValueType = (value: string): JsonValue => {
  const trimmedValue = value.trim();
  if (trimmedValue.toLowerCase() === 'true') return true;
  if (trimmedValue.toLowerCase() === 'false') return false;
  if (trimmedValue.toLowerCase() === 'null') return null;
  if (trimmedValue === '') return ''; // Keep empty strings as empty strings

  // Check if it's a number (integer or float)
  const num = Number(trimmedValue);
  if (!isNaN(num) && isFinite(num)) {
    return num;
  }

  // If none of the above, return the original string
  return value;
};
