import { camelCase, isPlainObject, mapKeys } from "lodash";

// Recursively transform all keys in an object from snake_case to camelCase
const snakeCaseToCamelCaseKeys = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeCaseToCamelCaseKeys(v)) as T;
  }

  if (isPlainObject(obj) && obj !== null) {
    return mapKeys(obj, (_, key) => camelCase(key)) as T;
  }

  return obj;
};

export default snakeCaseToCamelCaseKeys;
